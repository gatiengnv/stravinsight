import React from 'react';

export default function PredictionResult({
                                             prediction,
                                             distance,
                                             elevation,
                                             heartRateZone,
                                             gender,
                                             formatTime,
                                             resetPrediction
                                         }) {
    return (
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

            <button
                className="btn btn-primary mt-4"
                onClick={resetPrediction}
            >
                New prediction
            </button>
        </div>
    );
}
