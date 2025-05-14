import React, {useEffect, useRef} from "react";
import polyline from "@mapbox/polyline";

export default function ActivityMap({activities, filter, heatmapMode}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const polylineRefs = useRef([]);
    const infoWindowRef = useRef(null);

    useEffect(() => {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API is not loaded");
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center: {lat: 48.8566, lng: 2.3522},
            zoom: 12,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
        });

        mapInstanceRef.current = map;
        const bounds = new window.google.maps.LatLngBounds();
        polylineRefs.current = [];

        infoWindowRef.current = new window.google.maps.InfoWindow();
        infoWindowRef.current.currentPolyline = null;

        window.viewActivityDetails = (activityId) => {
            if (activityId) {
                window.location.href = `/activities/${activityId}`;
            }
        };

        let activitiesToShow = [...activities];
        if (filter === "recent") {
            activitiesToShow = activities
                .slice()
                .sort((a, b) => new Date(b.startDateLocal) - new Date(a.startDateLocal))
                .slice(0, 10);
        } else if (filter === "old") {
            activitiesToShow = activities
                .slice()
                .sort((a, b) => new Date(a.startDateLocal) - new Date(b.startDateLocal))
                .slice(0, 10);
        }

        activitiesToShow.forEach((activity, index) => {
            if (activity.summaryPolyline) {
                const decodedPath = polyline.decode(activity.summaryPolyline);
                const googlePath = decodedPath.map(([lat, lng]) => ({lat, lng}));

                googlePath.forEach(point => bounds.extend(point));

                const activityPath = new window.google.maps.Polyline({
                    path: googlePath,
                    geodesic: true,
                    strokeColor: heatmapMode ? "#FC4C02" : getActivityColor(index),
                    strokeOpacity: heatmapMode ? 0.5 : 0.7,
                    strokeWeight: 3,
                    zIndex: 1
                });

                activityPath.activity = activity;

                activityPath.addListener("mouseover", (event) => {
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }

                    activityPath.setOptions({
                        strokeWeight: 5,
                        strokeOpacity: 1,
                        zIndex: 100
                    });

                    infoWindowRef.current.currentPolyline = activityPath;
                    showInfoWindow(activity, event.latLng, map, activityPath);
                });

                activityPath.addListener("click", (event) => {
                    if (event && event.stop) {
                        event.stop();
                    }

                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }

                    activityPath.setOptions({
                        strokeWeight: 5,
                        strokeOpacity: 1,
                        zIndex: 100
                    });

                    infoWindowRef.current.currentPolyline = activityPath;
                    showInfoWindow(activity, event.latLng, map, activityPath);
                });

                activityPath.addListener("mouseout", () => {
                    if (!infoWindowRef.current || infoWindowRef.current.currentPolyline !== activityPath) {
                        activityPath.setOptions({
                            strokeWeight: 3,
                            strokeOpacity: heatmapMode ? 0.5 : 0.7,
                            zIndex: 1
                        });
                    }
                });

                activityPath.setMap(map);
                polylineRefs.current.push(activityPath);
            }
        });

        map.addListener("click", () => {
            polylineRefs.current.forEach(line => {
                line.setOptions({
                    strokeWeight: 3,
                    strokeOpacity: heatmapMode ? 0.5 : 0.7,
                    zIndex: 1
                });
            });

            if (infoWindowRef.current) {
                infoWindowRef.current.close();
                infoWindowRef.current.currentPolyline = null;
            }
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
        }

        return () => {
            polylineRefs.current.forEach(polyline => {
                if (polyline) polyline.setMap(null);
            });
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
            delete window.viewActivityDetails;
        };
    }, [activities, filter, heatmapMode]);

    const getActivityColor = (index) => {
        const colors = [
            "#FC4C02", "#1E88E5", "#43A047", "#E53935", "#8E24AA",
            "#3949AB", "#039BE5", "#00897B", "#7CB342", "#C0CA33"
        ];
        return colors[index % colors.length];
    };

    const showInfoWindow = (activity, position, map, polyline) => {
        const dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
        const formattedDate = new Date(activity.startDateLocal).toLocaleDateString(undefined, dateOptions);

        const content = `
        <div class="p-2" style="color: black;">
            <strong>${activity.name}</strong><br/>
            <div class="mt-1">
                Distance: ${activity.distance}<br/>
                Date: ${formattedDate}
            </div>
            <div class="mt-2 text-center">
                <button
                    onclick="window.viewActivityDetails('${activity.id}')"
                    class="px-3 py-1 bg-[#FC4C02] text-white rounded hover:bg-[#e44600] text-sm font-medium"
                >
                    View details
                </button>
            </div>
        </div>
    `;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.setPosition(position);
        infoWindowRef.current.open(map);
        infoWindowRef.current.currentPolyline = polyline;
    };

    return (
        <div
            ref={mapRef}
            className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] bg-base-300 rounded-box"
        ></div>
    );
}
