import React from 'react';

export default function HeartRateZoneSelector({heartRateZoneList, heartRateZone, setHeartRateZone}) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {(heartRateZoneList.slice(0, heartRateZoneList.length - 1)).map((zone, index) => (
                <div
                    key={index}
                    className={`card p-4 cursor-pointer border ${heartRateZone === zone ? "border-primary" : "border-base-300"}`}
                    onClick={() => setHeartRateZone(zone)}
                >
                    <h3 className="font-bold">Zone {index + 1}</h3>
                    <p>{zone}</p>
                </div>
            ))}
        </div>
    );
}
