import React, {useEffect, useRef, useState} from "react";
import polyline from "@mapbox/polyline";

const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve(window.google.maps);
            return;
        }

        const googleMapsScript = document.getElementById('google-maps-script');

        if (googleMapsScript) {
            googleMapsScript.addEventListener('load', () => {
                if (window.google && window.google.maps) {
                    resolve(window.google.maps);
                } else {
                    reject(new Error('Google Maps API script loaded but google.maps is not available'));
                }
            });
            googleMapsScript.addEventListener('error', () => {
                reject(new Error('Failed to load Google Maps API script'));
            });
            return;
        }

        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=&libraries=geometry&callback=Function.prototype';
        script.async = true;
        script.defer = true;

        script.addEventListener('load', () => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
            } else {
                reject(new Error('Google Maps API script loaded but google.maps is not available'));
            }
        });

        script.addEventListener('error', () => {
            reject(new Error('Failed to load Google Maps API script'));
        });

        document.head.appendChild(script);
    });
};

export default function Map({encodedPolyline, averagePace, showMapControls = true}) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const animationRef = useRef(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const mapInstanceRef = useRef(null);
    const polylineRef = useRef(null);
    const fullPathRef = useRef(null);
    const googlePathRef = useRef(null);
    const animateMarkerFnRef = useRef(null);
    const animationStateRef = useRef({
        currentIndex: 0,
        progressivePathPoints: [],
        lastTimestamp: 0,
        interpolationFactor: 0,
        fromPoint: null,
        toPoint: null
    });

    useEffect(() => {
        if (!encodedPolyline) {
            return;
        }

        let isComponentMounted = true;
        let map = null;

        const initMap = async () => {
            try {
                await loadGoogleMapsApi();

                if (!isComponentMounted || !mapRef.current) return;

                map = new window.google.maps.Map(mapRef.current, {
                    center: {lat: 48.8566, lng: 2.3522},
                    zoom: 16,
                    mapTypeId: window.google.maps.MapTypeId.SATELLITE,
                    mapTypeControl: showMapControls,
                    streetViewControl: showMapControls,
                    tilt: 45,
                    zoomControl: showMapControls,
                    disableDefaultUI: !showMapControls
                });
                mapInstanceRef.current = map;

                const decodedPath = polyline.decode(encodedPolyline);
                const googlePath = decodedPath.map(([lat, lng]) => ({lat, lng}));
                googlePathRef.current = googlePath;

                const fullPath = new window.google.maps.Polyline({
                    path: googlePath,
                    geodesic: true,
                    strokeColor: "#FC4C02",
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                });
                fullPath.setMap(map);
                fullPathRef.current = fullPath;

                const progressivePath = new window.google.maps.Polyline({
                    path: [googlePath[0]],
                    geodesic: true,
                    strokeColor: "#FC4C02",
                    strokeOpacity: 0,
                    strokeWeight: 4,
                });
                progressivePath.setMap(map);
                polylineRef.current = progressivePath;

                const runnerIcon = {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 7,
                    fillColor: "#FC4C02",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                };

                const marker = new window.google.maps.Marker({
                    position: googlePath[0],
                    map: map,
                    icon: runnerIcon,
                    visible: false,
                    title: "Runner"
                });

                markerRef.current = marker;

                const bounds = new window.google.maps.LatLngBounds();
                googlePath.forEach((point) => bounds.extend(point));
                map.fitBounds(bounds, {padding: 50});

                animationStateRef.current = {
                    currentIndex: 0,
                    progressivePathPoints: [googlePath[0]],
                    lastTimestamp: 0,
                    interpolationFactor: 0,
                    fromPoint: googlePath[0],
                    toPoint: googlePath[1] || googlePath[0]
                };
            } catch (err) {
                console.error("Error initializing Google Maps:", err);
            }
        };

        initMap();

        return () => {
            isComponentMounted = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            if (polylineRef.current) {
                polylineRef.current.setMap(null);
            }
            if (fullPathRef.current) {
                fullPathRef.current.setMap(null);
            }
        };
    }, [encodedPolyline, animationKey]);

    useEffect(() => {
        if (!isAnimating || !mapInstanceRef.current || !googlePathRef.current) return;

        let animationSpeed = 500;
        const googlePath = googlePathRef.current;

        if (averagePace) {
            let paceValue = 0;

            if (typeof averagePace === 'number') {
                paceValue = averagePace;
            } else if (typeof averagePace === 'string') {
                const cleanPace = averagePace.replace('/km', '');

                if (cleanPace.includes(':')) {
                    const [minutes, seconds] = cleanPace.split(':').map(Number);
                    paceValue = minutes + seconds / 60;
                } else {
                    paceValue = parseFloat(cleanPace);
                }
            }

            if (!isNaN(paceValue) && paceValue > 0) {
                animationSpeed = Math.max(150, Math.min(1000, paceValue * 80));
            }
        }

        const state = animationStateRef.current;

        const animateMarker = (timestamp) => {
            if (!state.lastTimestamp) state.lastTimestamp = timestamp;

            const elapsed = Math.min(timestamp - state.lastTimestamp, 100);

            state.interpolationFactor += elapsed / animationSpeed;

            const lat = state.fromPoint.lat + (state.toPoint.lat - state.fromPoint.lat) * state.interpolationFactor;
            const lng = state.fromPoint.lng + (state.toPoint.lng - state.fromPoint.lng) * state.interpolationFactor;
            const interpolatedPosition = {lat, lng};

            markerRef.current.setPosition(interpolatedPosition);

            if (state.progressivePathPoints.length > 0) {
                state.progressivePathPoints[state.progressivePathPoints.length - 1] = interpolatedPosition;
            } else {
                state.progressivePathPoints.push(interpolatedPosition);
            }
            polylineRef.current.setPath(state.progressivePathPoints);

            try {
                mapInstanceRef.current.setCenter(interpolatedPosition);
            } catch (e) {
                console.warn("Error when moving the camera:", e);
            }

            if (state.interpolationFactor >= 1) {
                state.currentIndex++;
                state.interpolationFactor = state.interpolationFactor - 1;

                if (state.currentIndex < googlePath.length - 1) {
                    state.fromPoint = googlePath[state.currentIndex];
                    state.toPoint = googlePath[state.currentIndex + 1];

                    state.progressivePathPoints.push(interpolatedPosition);

                    try {
                        if (window.google.maps.geometry) {
                            const heading = window.google.maps.geometry.spherical.computeHeading(
                                new window.google.maps.LatLng(state.fromPoint.lat, state.fromPoint.lng),
                                new window.google.maps.LatLng(state.toPoint.lat, state.toPoint.lng)
                            );
                            mapInstanceRef.current.setHeading(heading);
                        }
                    } catch (e) {
                        console.warn("Unable to calculate heading:", e);
                    }
                } else if (state.currentIndex === googlePath.length - 1) {
                    state.fromPoint = googlePath[googlePath.length - 1];
                    state.toPoint = googlePath[googlePath.length - 1];
                }
            }

            if (state.currentIndex < googlePath.length) {
                animationRef.current = requestAnimationFrame(animateMarker);
            } else {
                setIsAnimating(false);
                setHasAnimated(true);

                fullPathRef.current.setOptions({strokeOpacity: 1.0});
                polylineRef.current.setOptions({strokeOpacity: 0});
                markerRef.current.setVisible(false);

                const bounds = new window.google.maps.LatLngBounds();
                googlePath.forEach((point) => bounds.extend(point));
                mapInstanceRef.current.fitBounds(bounds, {padding: 50});
                mapInstanceRef.current.setOptions({
                    disableDefaultUI: !showMapControls,
                    gestureHandling: showMapControls ? "auto" : "none",
                    zoomControl: showMapControls,
                });
                mapInstanceRef.current.setTilt(0);
            }

            state.lastTimestamp = timestamp;
        };

        animateMarkerFnRef.current = animateMarker;

        fullPathRef.current.setOptions({strokeOpacity: 0.15});
        polylineRef.current.setOptions({strokeOpacity: 1.0});
        markerRef.current.setVisible(true);

        mapInstanceRef.current.setOptions({
            disableDefaultUI: !showMapControls,
            gestureHandling: showMapControls ? "auto" : "none",
            zoomControl: showMapControls,
        });

        mapInstanceRef.current.setCenter(googlePath[0]);
        mapInstanceRef.current.setZoom(18);
        mapInstanceRef.current.setTilt(45);

        animationRef.current = requestAnimationFrame(animateMarker);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        };
    }, [isAnimating, averagePace]);

    useEffect(() => {
        if (!isAnimating) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                    animationRef.current = null;
                }
            } else if (isAnimating && animateMarkerFnRef.current) {
                animationStateRef.current.lastTimestamp = 0;
                animationRef.current = requestAnimationFrame(animateMarkerFnRef.current);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isAnimating]);

    const startAnimation = () => {
        setIsAnimating(true);
    };

    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        setIsAnimating(false);

        if (mapInstanceRef.current && googlePathRef.current) {
            const googlePath = googlePathRef.current;

            animationStateRef.current = {
                currentIndex: 0,
                progressivePathPoints: [googlePath[0]],
                lastTimestamp: 0,
                interpolationFactor: 0,
                fromPoint: googlePath[0],
                toPoint: googlePath[1] || googlePath[0]
            };

            if (markerRef.current) {
                markerRef.current.setPosition(googlePath[0]);
            }

            if (polylineRef.current) {
                polylineRef.current.setPath([googlePath[0]]);
            }

            const bounds = new window.google.maps.LatLngBounds();
            googlePath.forEach(point => bounds.extend(point));
            mapInstanceRef.current.fitBounds(bounds, {padding: 50});

            mapInstanceRef.current.setOptions({
                disableDefaultUI: !showMapControls,
                gestureHandling: showMapControls ? "auto" : "none",
                zoomControl: showMapControls,
            });
            mapInstanceRef.current.setTilt(0);
        }

        if (fullPathRef.current) {
            fullPathRef.current.setOptions({strokeOpacity: 1.0});
        }

        if (polylineRef.current) {
            polylineRef.current.setOptions({strokeOpacity: 0});
        }

        if (markerRef.current) {
            markerRef.current.setVisible(false);
        }
    };

    const restartAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }

        setIsAnimating(false);
        setAnimationKey(prevKey => prevKey + 1);

        setTimeout(() => {
            setIsAnimating(true);
        }, 50);
    };

    return (
        <div className="relative w-full">
            <div
                ref={mapRef}
                className="w-full h-[50vh] min-h-[300px] max-h-[600px] bg-base-300 rounded-box"
            ></div>
            {showMapControls && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {isAnimating && (
                        <button
                            onClick={stopAnimation}
                            className="bg-error text-white py-2 px-4 rounded-full shadow-md hover:bg-error-focus transition-colors"
                        >
                            Stop
                        </button>
                    )}
                    {!isAnimating && (
                        <button
                            onClick={hasAnimated ? restartAnimation : startAnimation}
                            className="bg-primary text-white py-2 px-4 rounded-full shadow-md hover:bg-primary-focus transition-colors"
                        >
                            {hasAnimated ? "Replay" : "Play"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
