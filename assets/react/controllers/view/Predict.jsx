import React, {useEffect, useRef, useState} from "react";
import Drawer from "../components/Drawer";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Predict({heartRateZoneList}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [points, setPoints] = useState([]);
    const [distance, setDistance] = useState(0);
    const [elevation, setElevation] = useState(0);
    const [heartRateZone, setHeartRateZone] = useState("");
    const [gender, setGender] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [selectedMarathon, setSelectedMarathon] = useState(null);
    const [routeType, setRouteType] = useState("predefined");

    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const polylineRef = useRef(null);
    const pointsRef = useRef([]);

    const famousMarathons = [
        {
            name: "Paris Marathon",
            distance: 42.195,
            elevation: 162,
            description: "Iconic course through the French capital"
        },
        {
            name: "Berlin Marathon",
            distance: 42.195,
            elevation: 21,
            description: "Fast and flat course, ideal for records"
        },
        {
            name: "New York Marathon",
            distance: 42.195,
            elevation: 358,
            description: "Challenging course through the five boroughs"
        },
        {
            name: "Boston Marathon",
            distance: 42.195,
            elevation: 235,
            description: "The oldest annual marathon with challenging hills"
        },
        {
            name: "London Marathon",
            distance: 42.195,
            elevation: 108,
            description: "Fast course along the Thames"
        },
        {
            name: "Half Marathon",
            distance: 21.1,
            elevation: 80,
            description: "Standard half marathon distance"
        },
        {
            name: "10K Race",
            distance: 10,
            elevation: 40,
            description: "Standard road race distance"
        }
    ];

    const selectMarathon = (marathon) => {
        setSelectedMarathon(marathon);
        setDistance(marathon.distance);
        setElevation(marathon.elevation);
        loadSimilarActivities(marathon.distance);
    };

    const loadSimilarActivities = (distance) => {
        setLoading(true);
        const distanceInMeters = Math.round(distance * 1000);
        fetch(`/api/similar-activities/${distanceInMeters}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                setActivities(data.activities);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const cleanupMap = () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.off('click');
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
            polylineRef.current = null;
        };

        if (currentStep !== 0 || routeType !== "custom") {
            cleanupMap();
            return;
        }

        if (currentStep === 0 && routeType === "custom" && mapRef.current && !leafletMapRef.current) {
            cleanupMap();

            const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            leafletMapRef.current = map;

            const polyline = L.polyline([], {
                color: '#4285F4',
                weight: 4
            }).addTo(map);

            polylineRef.current = polyline;

            map.on('click', (e) => {
                const newPoint = {lat: e.latlng.lat, lng: e.latlng.lng};
                pointsRef.current = [...pointsRef.current, newPoint];
                setPoints(pointsRef.current);

                polylineRef.current.addLatLng([newPoint.lat, newPoint.lng]);
            });
        }

        return cleanupMap;
    }, [currentStep, routeType]);

    useEffect(() => {
        if (points.length > 1) {
            let totalDistance = 0;

            for (let i = 1; i < points.length; i++) {
                const p1 = L.latLng(points[i - 1].lat, points[i - 1].lng);
                const p2 = L.latLng(points[i].lat, points[i].lng);

                const segmentDistance = p1.distanceTo(p2);
                totalDistance += segmentDistance;
            }

            totalDistance = totalDistance / 1000;
            setDistance(totalDistance);
            loadSimilarActivities(totalDistance);
            setElevation(Math.round(totalDistance * 15));
        }
    }, [points]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.round(seconds % 60);

        return `${hours > 0 ? `${hours}h ` : ''}${minutes}min ${secs}s`;
    };

    const handleNext = async () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            setLoading(true);

            let heartRate;
            const rangeMatch = heartRateZone.match(/(\d+)\s*-\s*(\d+)/);
            if (rangeMatch) {
                const minHR = parseInt(rangeMatch[1], 10);
                const maxHR = parseInt(rangeMatch[2], 10);
                heartRate = Math.round((minHR + maxHR) / 2);
            } else {
                heartRate = 150;
            }

            const distanceInMeters = distance * 1000;

            try {
                const response = await fetch(
                    `http://localhost:5000/predict_duration?distance=${distanceInMeters}&elevation_gain=${elevation}&heart_rate=${heartRate}&gender=${gender}&similar_activities=${JSON.stringify(activities)}`,
                );

                if (!response.ok) {
                    throw new Error('Prediction error');
                }

                const data = await response.json();
                setPrediction(data);
                setCurrentStep(currentStep + 1);
            } catch (error) {
                alert('Unable to get prediction. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const clearRoute = () => {
        setPoints([]);
        pointsRef.current = [];
        if (polylineRef.current) {
            polylineRef.current.setLatLngs([]);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Choose your route</h2>

                        <div className="tabs tabs-boxed mb-4">
                            <a
                                className={`tab ${routeType === "predefined" ? 'tab-active' : ''}`}
                                onClick={() => {
                                    setRouteType("predefined");
                                    clearRoute();
                                }}
                            >
                                Predefined courses
                            </a>
                            <a
                                className={`tab ${routeType === "custom" ? 'tab-active' : ''}`}
                                onClick={() => {
                                    setRouteType("custom");
                                    setSelectedMarathon(null);
                                }}
                            >
                                Custom route
                            </a>
                        </div>

                        {routeType === "predefined" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {famousMarathons.map((marathon, index) => (
                                    <div
                                        key={index}
                                        className={`card p-4 cursor-pointer border transition-all hover:shadow-md
                                            ${selectedMarathon?.name === marathon.name ? "border-primary bg-base-200" : "border-base-300"}`}
                                        onClick={() => selectMarathon(marathon)}
                                    >
                                        <h3 className="font-bold">{marathon.name}</h3>
                                        <div className="text-sm">
                                            <p>{marathon.distance} km • {marathon.elevation} m elevation gain</p>
                                            <p className="opacity-70">{marathon.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <p className="mb-4">Click on the map to draw your route</p>
                                <div className="h-96 w-full mb-4">
                                    <div ref={mapRef} className="h-full w-full rounded-box"></div>
                                </div>
                                <button className="btn btn-secondary mr-2" onClick={clearRoute}>
                                    Clear
                                </button>
                            </>
                        )}

                        {(points.length > 1 || selectedMarathon) && (
                            <div className="stats shadow mt-4 mb-4 w-full">
                                <div className="stat">
                                    <div className="stat-title">Distance</div>
                                    <div className="stat-value">{distance.toFixed(2)} km</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Elevation</div>
                                    <div className="stat-value">{elevation} m</div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 1:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Choose your heart rate zone</h2>
                        <p className="mb-4">At what intensity will you run?</p>

                        <div className="grid grid-cols-3 gap-4">
                            {(heartRateZoneList.slice(0, heartRateZoneList.length - 1)).map((zone, index) => (
                                <div key={index}
                                     className={`card p-4 cursor-pointer border ${heartRateZone === zone ? "border-primary" : "border-base-300"}`}
                                     onClick={() => setHeartRateZone(zone)}
                                >
                                    <h3 className="font-bold">Zone {index + 1}</h3>
                                    <p>{zone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Your gender</h2>
                        <p className="mb-4">Select your gender for a more accurate prediction</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                className={`btn btn-lg ${gender === "M" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setGender("M")}
                            >
                                Male
                            </button>

                            <button
                                className={`btn btn-lg ${gender === "F" ? "btn-primary" : "btn-outline"}`}
                                onClick={() => setGender("F")}
                            >
                                Female
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-4">Your time prediction</h2>

                        {prediction && (
                            <div className="card bg-base-200 shadow-xl p-6 text-center">
                                <div className="stat-value text-4xl mb-4">
                                    {formatTime(prediction.seconds)}
                                </div>

                                <div className="stats shadow mt-4 mb-4 w-full">
                                    <div className="stat">
                                        <div className="stat-title">Distance</div>
                                        <div className="stat-value text-lg">{distance.toFixed(2)} km</div>
                                    </div>
                                    <div className="stat">
                                        <div className="stat-title">Elevation</div>
                                        <div className="stat-value text-lg">{elevation} m</div>
                                    </div>
                                </div>

                                <div className="text-sm opacity-70">
                                    <p>Intensity: {heartRateZone}</p>
                                    <p>Gender: {gender === "M" ? "Male" : "Female"}</p>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn btn-primary mt-4"
                            onClick={() => setCurrentStep(0)}
                        >
                            New prediction
                        </button>
                    </div>
                );
        }
    };

    return (
        <Drawer title={"Time Prediction"}>
            <div className="p-4">
                <ul className="steps w-full mb-8">
                    <li className={`step ${currentStep >= 0 ? "step-primary" : ""}`}>Route</li>
                    <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>Intensity</li>
                    <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>Gender</li>
                    <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>Result</li>
                </ul>

                {renderStep()}

                <div className="flex justify-between mt-8">
                    <button
                        className="btn"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={(currentStep === 0 && points.length < 2 && !selectedMarathon) ||
                            (currentStep === 1 && !heartRateZone) ||
                            (currentStep === 2 && !gender) ||
                            currentStep === 3 ||
                            loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            currentStep < 2 ? "Next" : "Predict"
                        )}
                    </button>
                </div>
            </div>
        </Drawer>
    );
}
