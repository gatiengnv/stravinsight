import React from 'react';

export default function MarathonSelector({famousMarathons, selectedMarathon, selectMarathon}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {famousMarathons.map((marathon, index) => (
                <div
                    key={index}
                    className={`card bg-base-200 shadow hover:shadow-lg cursor-pointer transition-all ${
                        selectedMarathon?.name === marathon.name ? 'border-2 border-primary' : ''
                    }`}
                    onClick={() => selectMarathon(marathon)}
                >
                    <div className="card-body">
                        <h3 className="card-title">{marathon.name}</h3>
                        <p>{marathon.description}</p>
                        <div className="mt-2 text-sm opacity-75">
                            <div>Distance: {marathon.distance} km</div>
                            <div>Elevation: {marathon.elevation} m</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
