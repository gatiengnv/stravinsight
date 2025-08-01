import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {useEffect, useRef, useState} from "react";
import Drawer from "../components/Drawer";
import GenderSelector from "../components/GenderSelector";
import HeartRateZoneSelector from "../components/HeartRateZoneSelector";
import PredictionResult from "../components/PredictionResult";
import Road from "../components/Road";
import Step from "../components/Step";
import StepPagination from "../components/StepPagination";

export default function Predict({heartRateZoneList, userProfileMedium}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [points, setPoints] = useState([]);
    const [distance, setDistance] = useState(0);
    const [elevation, setElevation] = useState(0);
    const [heartRateZone, setHeartRateZone] = useState("");
    const [gender, setGender] = useState("");
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [allActivities, setAllActivities] = useState([]);
    const [selectedMarathon, setSelectedMarathon] = useState(null);
    const [routeType, setRouteType] = useState("predefined");

    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const polylineRef = useRef(null);

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

    useEffect(() => {
        if (currentStep === 0 && routeType === "custom") {
            setTimeout(() => {
                if (leafletMapRef.current) {
                    leafletMapRef.current.remove();
                    leafletMapRef.current = null;
                    polylineRef.current = null;
                }

                if (mapRef.current) {
                    const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);

                    leafletMapRef.current = map;

                    polylineRef.current = L.polyline([], {
                        color: '#4285F4',
                        weight: 4
                    }).addTo(map);

                    if (points.length > 1) {
                        points.forEach(point => {
                            polylineRef.current.addLatLng([point.lat, point.lng]);
                        });
                    }

                    map.on('click', (e) => {
                        const newPoint = {lat: e.latlng.lat, lng: e.latlng.lng};

                        setPoints(currentPoints => {
                            return [...currentPoints, newPoint];
                        });

                        polylineRef.current.addLatLng([newPoint.lat, newPoint.lng]);
                    });
                }
            }, 100);
        }
    }, [currentStep, routeType]);

    const clearRoute = () => {
        setPoints([]);
        if (polylineRef.current) {
            polylineRef.current.setLatLngs([]);
        }
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

    const loadAllActivities = () => {
        setLoading(true);
        fetch(`/api/all-activities`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                setAllActivities(data.activities);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (points.length > 1) {
            let totalDistance = 0;

            for (let i = 1; i < points.length; i++) {
                const p1 = {lat: points[i - 1].lat, lng: points[i - 1].lng};
                const p2 = {lat: points[i].lat, lng: points[i].lng};

                const R = 6371e3;
                const φ1 = p1.lat * Math.PI / 180;
                const φ2 = p2.lat * Math.PI / 180;
                const Δφ = (p2.lat - p1.lat) * Math.PI / 180;
                const Δλ = (p2.lng - p1.lng) * Math.PI / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                const segmentDistance = R * c;
                totalDistance += segmentDistance;
            }

            totalDistance = totalDistance / 1000;
            setDistance(totalDistance);
            loadSimilarActivities(totalDistance);
            setElevation(Math.round(totalDistance * 15));
        }
    }, [points]);

    useEffect(() => {
        loadAllActivities();
    }, []);

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

            try {
                const parameters = {
                    distance: distance * 1000,
                    elevation_gain: elevation,
                    heart_rate: heartRate,
                    gender,
                    similar_activities: activities
                };
                const response = await fetch('/ai/predict_duration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(parameters)
                });

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

    const resetPrediction = () => {
        setCurrentStep(0);

        if (leafletMapRef.current) {
            leafletMapRef.current.off('click');
            leafletMapRef.current.remove();
            leafletMapRef.current = null;
            polylineRef.current = null;
        }

        if (routeType === "custom") {
            setRouteType("predefined");
            setTimeout(() => {
                setRouteType("custom");
            }, 50);
        }

        setPrediction(null);
        if (!selectedMarathon) {
            setPoints([]);
            setDistance(0);
            setElevation(0);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Road
                        routeType={routeType}
                        setRouteType={setRouteType}
                        clearRoute={clearRoute}
                        selectedMarathon={selectedMarathon}
                        setSelectedMarathon={setSelectedMarathon}
                        famousMarathons={famousMarathons}
                        selectMarathon={selectMarathon}
                        mapRef={mapRef}
                        points={points}
                        distance={distance}
                        elevation={elevation}
                    />
                );

            case 1:
                return (
                    <Step title="Choose your heart rate zone" description="At what intensity will you run?">
                        <HeartRateZoneSelector
                            heartRateZoneList={heartRateZoneList}
                            heartRateZone={heartRateZone}
                            setHeartRateZone={setHeartRateZone}
                        />
                    </Step>
                );

            case 2:
                return (
                    <Step title="Your gender" description="Select your gender for a more accurate prediction">
                        <GenderSelector gender={gender} setGender={setGender}/>
                    </Step>
                );

            case 3:
                return (
                    <Step title="Your time prediction" description="Your time prediction for this route">
                        {prediction && (
                            <PredictionResult
                                prediction={prediction}
                                distance={distance}
                                elevation={elevation}
                                heartRateZone={heartRateZone}
                                gender={gender}
                                formatTime={formatTime}
                                resetPrediction={resetPrediction}
                            />
                        )}
                    </Step>
                );
        }
    };

    return (
        <Drawer title="Time Prediction" userProfileMedium={userProfileMedium}>
            <div role="alert" className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Still in development: Bad predictions can happen</span>
            </div>
            <div className="p-4">
                <ul className="steps w-full mb-8">
                    <li className={`step ${currentStep >= 0 ? "step-primary" : ""}`}>Route</li>
                    <li className={`step ${currentStep >= 1 ? "step-primary" : ""}`}>Intensity</li>
                    <li className={`step ${currentStep >= 2 ? "step-primary" : ""}`}>Gender</li>
                    <li className={`step ${currentStep >= 3 ? "step-primary" : ""}`}>Result</li>
                </ul>

                {renderStep()}
                <StepPagination
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    currentStep={currentStep}
                    points={points}
                    selectedMarathon={selectedMarathon}
                    loading={loading}
                    heartRateZone={heartRateZone}
                    gender={gender}
                />
            </div>
        </Drawer>
    );
}
