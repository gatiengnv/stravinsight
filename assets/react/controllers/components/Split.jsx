import React, {useState} from "react";

export default function Split({splitsMetric, splitsStandard}) {
    const [unit, setUnit] = useState('km');

    const hasMetricData = splitsMetric && Array.isArray(splitsMetric) && splitsMetric.length > 0;
    const hasStandardData = splitsStandard && Array.isArray(splitsStandard) && splitsStandard.length > 0;

    const formatPace = (secondsPerKm) => {
        if (!secondsPerKm || secondsPerKm === Infinity) return "--:--";
        const m = Math.floor(secondsPerKm / 60);
        const s = Math.floor(secondsPerKm % 60);
        return `${m}:${s.toString().padStart(2, "0")}/${unit === 'km' ? 'km' : 'mi'}`;
    };

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

    if (!hasMetricData && !hasStandardData) {
        return <div className="text-gray-400">No splits data available</div>;
    }

    return (
        <div>
            <div className="flex justify-center mb-4">
                <div className="tabs tabs-boxed">
                    <button
                        className={`tab ${unit === 'km' ? 'tab-active' : ''}`}
                        onClick={() => setUnit('km')}
                        disabled={!hasMetricData}
                    >
                        Kilometers
                    </button>
                    <button
                        className={`tab ${unit === 'miles' ? 'tab-active' : ''}`}
                        onClick={() => setUnit('miles')}
                        disabled={!hasStandardData}
                    >
                        Miles
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                {unit === 'km' && hasMetricData ? (
                    <table className="table table-zebra table-sm w-full">
                        <thead>
                        <tr>
                            <th>KM</th>
                            <th>Distance (m)</th>
                            <th>Elapsed Time (s)</th>
                            <th>Moving Time (s)</th>
                            <th>Elevation (m)</th>
                            <th>Avg. Speed (m/s)</th>
                            <th>Grade Adj. Speed (m/s)</th>
                            <th>Avg. HR (bpm)</th>
                            <th>Pace</th>
                            <th>Pace Zone</th>
                        </tr>
                        </thead>
                        <tbody>
                        {splitsMetric.map((split, index) => (
                            <tr key={index}>
                                <td>{split.split}</td>
                                <td>{split.distance && split.distance.toFixed(1) || '-'}</td>
                                <td>{split.elapsed_time || '-'}</td>
                                <td>{split.moving_time || '-'}</td>
                                <td className={(split.elevation_difference > 0 && "text-green-400") ||
                                    (split.elevation_difference < 0 && "text-red-400") || ""}>
                                    {split.elevation_difference !== undefined ?
                                        ((split.elevation_difference > 0 ?
                                            `+${split.elevation_difference.toFixed(1)}` :
                                            split.elevation_difference.toFixed(1))) :
                                        '-'}
                                </td>
                                <td>{split.average_speed && split.average_speed.toFixed(2) || '-'}</td>
                                <td>{split.average_grade_adjusted_speed && split.average_grade_adjusted_speed.toFixed(2) || '-'}</td>
                                <td>{split.average_heartrate && split.average_heartrate.toFixed(1) || '-'}</td>
                                <td>{formatPace(split.elapsed_time / (split.distance / 1000))}</td>
                                <td className={split.pace_zone && getPaceZoneClass(split.pace_zone) || "text-gray-400"}>
                                    {split.pace_zone || '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : unit === 'miles' && hasStandardData ? (
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
                            <th>Pace</th>
                            <th>Pace Zone</th>
                        </tr>
                        </thead>
                        <tbody>
                        {splitsStandard.map((split, index) => (
                            <tr key={index}>
                                <td>{split.split || '-'}</td>
                                <td>{split.distance && split.distance.toFixed(1) || '-'}</td>
                                <td>{split.elapsed_time || '-'}</td>
                                <td>{split.moving_time || '-'}</td>
                                <td className={(split.elevation_difference > 0 && "text-green-400") ||
                                    (split.elevation_difference < 0 && "text-red-400") || ""}>
                                    {split.elevation_difference !== undefined ?
                                        ((split.elevation_difference > 0 ?
                                            `+${split.elevation_difference.toFixed(1)}` :
                                            split.elevation_difference.toFixed(1))) :
                                        '-'}
                                </td>
                                <td>{split.average_speed && split.average_speed.toFixed(2) || '-'}</td>
                                <td>{split.average_grade_adjusted_speed && split.average_grade_adjusted_speed.toFixed(2) || '-'}</td>
                                <td>{split.average_heartrate && split.average_heartrate.toFixed(1) || '-'}</td>
                                <td>{formatPace(split.elapsed_time / (split.distance / 1600))}</td>
                                <td className={split.pace_zone && getPaceZoneClass(split.pace_zone) || "text-gray-400"}>
                                    {split.pace_zone || '-'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-gray-400 text-center">No splits data available
                        for {unit === 'km' ? 'kilometers' : 'miles'}</div>
                )}
            </div>
        </div>
    );
}
