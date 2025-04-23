import React from "react";

export default function StandardSplits({splitsStandard}) {

    const getPaceZoneClass = (zone) => {
        switch (zone) {
            case 1:
                return "text-blue-400";
            case 2:
                return "text-green-400";
            case 3:
                return "text-yellow-400";
            case 4:
                return "text-orange-400";
            case 5:
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra table-sm w-full">
                <thead>
                <tr>
                    <th>Split</th>
                    <th>Distance (m)</th>
                    <th>Elapsed Time (s)</th>
                    <th>Moving Time (s)</th>
                    <th>Elevation (m)</th>
                    <th>Avg. Speed (m/s)</th>
                    <th>Grade Adj. Speed (m/s)</th>
                    <th>Avg. HR (bpm)</th>
                    <th>Pace Zone</th>
                </tr>
                </thead>
                <tbody>
                {splitsStandard.map((split, index) => (
                    <tr key={index}>
                        <td>{split.split}</td>
                        <td>{split.distance.toFixed(1)}</td>
                        <td>{split.elapsed_time}</td>
                        <td>{split.moving_time}</td>
                        <td className={split.elevation_difference > 0 ? "text-green-400" : "text-red-400"}>
                            {split.elevation_difference > 0
                                ? `+${split.elevation_difference.toFixed(1)}`
                                : split.elevation_difference.toFixed(1)}
                        </td>
                        <td>{split.average_speed.toFixed(2)}</td>
                        <td>{split.average_grade_adjusted_speed.toFixed(2)}</td>
                        <td>{split.average_heartrate.toFixed(1)}</td>
                        <td className={getPaceZoneClass(split.pace_zone)}>
                            {split.pace_zone}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
