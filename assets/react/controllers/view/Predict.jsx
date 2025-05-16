import React, {useEffect, useRef, useState} from "react";
import Drawer from "../components/Drawer";
import Step from "../components/Step";
import Road from "../components/Road";
import StepPagination from "../components/StepPagination";
import HeartRateZoneSelector from "../components/HeartRateZoneSelector";
import GenderSelector from "../components/GenderSelector";
import PredictionResult from "../components/PredictionResult";
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
        if (routeType === "custom" && mapRef.current && !leafletMapRef.current) {
            const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            leafletMapRef.current = map;

            polylineRef.current = L.polyline([], {
                color: '#4285F4',
                weight: 4
            }).addTo(map);

            map.on('click', (e) => {
                const newPoint = {lat: e.latlng.lat, lng: e.latlng.lng};

                setPoints(currentPoints => {
                    return [...currentPoints, newPoint];
                });

                polylineRef.current.addLatLng([newPoint.lat, newPoint.lng]);
            });
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.off('click');
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                polylineRef.current = null;
            }
        };
    }, [routeType]);

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

    const resetPrediction = () => {
        setCurrentStep(0);
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
        <Drawer title="Time Prediction">
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
