import React from "react";

const activityData = {
    id: 1,
    title: "Morning Run",
    type: "Run",
    date: "2023-10-26T07:15:00Z",
    distance: 10.5,
    movingTime: 3600,
    elapsedTime: 3720,
    elevationGain: 120,
    calories: 550,
    avgPace: 342.8,
    avgHeartRate: 155,
    maxHeartRate: 175,
    splits: [
        { km: 1, time: 340, hr: 145, elev_diff: 10 },
        { km: 2, time: 345, hr: 150, elev_diff: 8 },
        { km: 3, time: 342, hr: 152, elev_diff: 12 },
        { km: 4, time: 348, hr: 155, elev_diff: 15 },
        { km: 5, time: 340, hr: 158, elev_diff: 10 },
        { km: 6, time: 345, hr: 160, elev_diff: 11 },
        { km: 7, time: 350, hr: 162, elev_diff: 14 },
        { km: 8, time: 342, hr: 165, elev_diff: 13 },
        { km: 9, time: 338, hr: 168, elev_diff: 12 },
        { km: 10, time: 335, hr: 170, elev_diff: 15 },
        { km: 10.5, time: 175, hr: 172, elev_diff: 5 },
    ],
    description:
        "Felt good today, pushed the pace a bit on the last few kilometers. Nice cool morning.",
};

const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h > 0) parts.push(h.toString().padStart(2, "0"));
    parts.push(m.toString().padStart(h > 0 ? 2 : 1, "0"));
    parts.push(s.toString().padStart(2, "0"));
    return parts.join(":");
};

const formatPace = (secondsPerKm) => {
    if (!secondsPerKm || secondsPerKm === Infinity) return "--:--";
    const m = Math.floor(secondsPerKm / 60);
    const s = Math.floor(secondsPerKm % 60);
    return `${m}:${s.toString().padStart(2, "0")}/km`;
};

const RunIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12.75 19.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 8.25A4.5 4.5 0 0 1 11.25 3.75a4.5 4.5 0 0 1 4.5 4.5v6"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 10.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 15l-1.5-3-3 1.5"
        />
    </svg>
);
const MapIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m0 0v2.25m0-2.25h1.5m-1.5 0H5.25m11.25-8.25v2.25m0 0h-1.5m1.5 0H16.5m-1.5 0V8.25m0 0V6"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);
const MountainIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28L19.5 18"
        />
    </svg>
);
const FireIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
        />
    </svg>
);
const HeartIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
    </svg>
);
const GaugeIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5a8.25 8.25 0 1 0 7.5 14.146M12 6.375v3.75m.375-3.75L14.25 9"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12.75a8.25 8.25 0 0 1-7.5-5.354M12 12.75a8.25 8.25 0 0 0 7.5-5.354"
        />
    </svg>
);

const ClockIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);
const MapPinIcon = ({ className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
    </svg>
);

export default function ActivityDetails() {
    const activityDate = new Date(activityData.date);
    const formattedDate = activityDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = activityDate.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                <div className="flex items-center gap-3">
                    {activityData.type === "Run" && (
                        <RunIcon className="w-8 h-8 text-secondary flex-shrink-0" />
                    )}

                    <h1 className="text-2xl font-bold text-base-content">
                        {activityData.title}
                    </h1>
                </div>
                <div className="text-sm text-base-content opacity-80 text-left sm:text-right">
                    {formattedDate} at {formattedTime}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow lg:w-2/3">
                    <div className="card bg-neutral text-neutral-content p-4 md:p-6 shadow-lg h-full">
                        <h2 className="card-title text-xl font-bold mb-4">Route</h2>
                        <div className="aspect-video bg-base-300 rounded-box flex items-center justify-center">
                            <div className="text-center p-4">
                                <MapIcon className="w-16 h-16 text-base-content opacity-30 mx-auto mb-2" />
                                <p className="text-sm opacity-60">Map Area Placeholder</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 lg:w-1/3">
                    <div className="stats stats-vertical shadow w-full mb-6">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <MapPinIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Distance</div>
                            <div className="stat-value">
                                {activityData.distance.toFixed(2)} km
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <GaugeIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Avg Pace</div>
                            <div className="stat-value">
                                {formatPace(activityData.avgPace)}
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Moving Time</div>
                            <div className="stat-value">
                                {formatTime(activityData.movingTime)}
                            </div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <MountainIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Elevation Gain</div>
                            <div className="stat-value">{activityData.elevationGain} m</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <FireIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Calories</div>
                            <div className="stat-value">{activityData.calories}</div>
                            <div className="stat-desc opacity-50">(estimated)</div>
                        </div>
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <HeartIcon className="w-6 h-6" />
                            </div>
                            <div className="stat-title">Avg Heart Rate</div>
                            <div className="stat-value">{activityData.avgHeartRate} bpm</div>
                            <div className="stat-desc opacity-50">
                                Max: {activityData.maxHeartRate} bpm
                            </div>
                        </div>
                    </div>

                    <div className="card bg-neutral text-neutral-content p-4 md:p-6 shadow-lg">
                        <h2 className="card-title text-xl font-bold mb-4">
                            Splits (per km)
                        </h2>

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
                    </div>
                </div>
            </div>

            {activityData.description && (
                <div className="card bg-neutral text-neutral-content p-4 md:p-6 shadow-lg mt-6">
                    <h2 className="card-title text-xl font-bold mb-2">Description</h2>
                    <p className="text-sm opacity-90 whitespace-pre-wrap">
                        {activityData.description}
                    </p>
                </div>
            )}
        </div>
    );
}
