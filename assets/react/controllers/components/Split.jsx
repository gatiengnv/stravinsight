import React from "react";

export default function Split({splitsMetric}) {
    const formatPace = (secondsPerKm) => {
        if (!secondsPerKm || secondsPerKm === Infinity) return "--:--";
        const m = Math.floor(secondsPerKm / 60);
        const s = Math.floor(secondsPerKm % 60);
        return `${m}:${s.toString().padStart(2, "0")}/km`;
    };

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-full">
                <thead>
                <tr>
                    <th>KM</th>
                    <th>Pace</th>
                    <th>HR</th>
                    <th>Elev +/-</th>
                </tr>
                </thead>
                <tbody>
                {splitsMetric.map((split, index) => (
                    <tr key={index}>
                        <td>{split.split}</td>
                        <td>
                            {formatPace(split.elapsed_time / (split.distance / 1000))}
                        </td>
                        <td>{split.average_heartrate ? split.average_heartrate.toFixed(1) : "--"}</td>
                        <td>
                            {split.elevation_difference > 0
                                ? `+${split.elevation_difference}`
                                : split.elevation_difference}
                            m
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
