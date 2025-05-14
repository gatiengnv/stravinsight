import React from "react";
import Step from "./Step";

export default function Road({
                                 routeType,
                                 setRouteType,
                                 clearRoute,
                                 selectedMarathon,
                                 setSelectedMarathon,
                                 famousMarathons,
                                 selectMarathon,
                                 mapRef,
                                 points,
                                 distance,
                                 elevation
                             }) {
    const isDistanceValid = distance <= 100;

    return (
        <Step title="Choose your route" description="">
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
                    {famousMarathons
                        .filter(marathon => marathon.distance <= 100)
                        .map((marathon, index) => (
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
                <>
                    <div className="stats shadow mt-4 mb-4 w-full">
                        <div className="stat">
                            <div className="stat-title">Distance</div>
                            <div
                                className={`stat-value ${!isDistanceValid ? "text-error" : ""}`}>{distance.toFixed(2)} km
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Elevation</div>
                            <div className="stat-value">{elevation} m</div>
                        </div>
                    </div>

                    {!isDistanceValid && (
                        <div className="alert alert-error mt-2">
                            The distance must be between 0 and 100 km to have a valid prediction.
                        </div>
                    )}
                </>
            )}
        </Step>
    );
}
