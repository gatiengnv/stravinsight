import React from "react";

export default function Split({activityData}) {
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
                {activityData.splits.map((split, index) => (
                    <tr key={index}>
                        <td>
                            {split.km % 1 === 0 ? split.km : split.km.toFixed(1)}
                        </td>
                        <td>
                            {formatPace(
                                split.time /
                                (split.km -
                                    (activityData.splits[index - 1]?.km || 0)),
                            )}
                        </td>
                        <td>{split.hr || "--"}</td>
                        <td>
                            {split.elev_diff > 0
                                ? `+${split.elev_diff}`
                                : split.elev_diff}
                            m
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
