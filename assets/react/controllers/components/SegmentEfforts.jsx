import React from 'react';

export default function SegmentEfforts({segmentEfforts}) {
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const calculatePace = (timeInSeconds, distanceInMeters) => {
        const paceInSecondsPerKm = (timeInSeconds / distanceInMeters) * 1000;
        const paceMinutes = Math.floor(paceInSecondsPerKm / 60);
        const paceSeconds = Math.floor(paceInSecondsPerKm % 60);
        return `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}/km`;
    };

    return (
        <div className="segment-efforts-stats">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {segmentEfforts.map((effort) => (
                    <div key={effort.id}
                         className="bg-base-300 rounded-lg shadow-md overflow-hidden border border-gray-700">
                        <div className="bg-[#FC4C02] text-white p-3">
                            <h3 className="text-xl font-semibold">{effort.name}</h3>
                            <p className="text-sm opacity-90">{effort.segment.name}</p>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-wrap gap-3 mb-3">
                                <div className="stat-box bg-base-200 rounded p-2 flex-1 min-w-[120px]">
                                    <div className="text-sm text-gray-400">Distance</div>
                                    <div
                                        className="text-lg font-semibold text-white">{(effort.distance / 1000).toFixed(2)} km
                                    </div>
                                </div>

                                <div className="stat-box bg-base-200 rounded p-2 flex-1 min-w-[120px]">
                                    <div className="text-sm text-gray-400">Time</div>
                                    <div
                                        className="text-lg font-semibold text-white">{formatTime(effort.elapsed_time)}</div>
                                </div>

                                <div className="stat-box bg-base-200 rounded p-2 flex-1 min-w-[120px]">
                                    <div className="text-sm text-gray-400">Pace</div>
                                    <div
                                        className="text-lg font-semibold text-white">{calculatePace(effort.moving_time, effort.distance)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                {effort.average_cadence && (
                                    <div className="stat-item">
                                        <div className="text-sm text-gray-400">Avg. Cadence</div>
                                        <div
                                            className="text-base font-semibold text-white">{effort.average_cadence.toFixed(1)}</div>
                                    </div>
                                )}

                                {effort.average_heartrate && (
                                    <div className="stat-item">
                                        <div className="text-sm text-gray-400">Avg. HR</div>
                                        <div
                                            className="text-base font-semibold text-white">{effort.average_heartrate.toFixed(1)} bpm
                                        </div>
                                    </div>
                                )}

                                {effort.max_heartrate && (
                                    <div className="stat-item">
                                        <div className="text-sm text-gray-400">Max HR</div>
                                        <div
                                            className="text-base font-semibold text-white">{effort.max_heartrate.toFixed(1)} bpm
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="text-xs text-gray-400 mb-3">
                                {formatDate(effort.start_date_local)}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Segment Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                                    <div>
                                        <span className="text-gray-400">Grade:</span> {effort.segment.average_grade}%
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Max Grade:</span> {effort.segment.maximum_grade}%
                                    </div>
                                    <div>
                                        <span
                                            className="text-gray-400">Elevation:</span> {Math.floor(effort.segment.elevation_low)}m
                                        - {Math.ceil(effort.segment.elevation_high)}m
                                    </div>
                                    <div>
                                        <span
                                            className="text-gray-400">Elevation Gain:</span> {Math.round(effort.segment.elevation_high - effort.segment.elevation_low)}m
                                    </div>
                                </div>
                                <div className="text-sm mt-1 text-gray-300">
                                    <span
                                        className="text-gray-400">Location:</span> {effort.segment.city}, {effort.segment.country}
                                </div>
                            </div>

                            {effort.achievements && effort.achievements.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Achievements</h4>
                                    <ul className="text-sm text-gray-300">
                                        {effort.achievements.map((achievement, index) => (
                                            <li key={index} className="flex items-center mb-1">
                                                <span className="text-yellow-500 mr-2">🏆</span>
                                                {achievement.type === "segment_effort_count_leader" && (
                                                    <span>Passage Record ({achievement.effort_count})</span>
                                                )}
                                                {achievement.type !== "segment_effort_count_leader" && (
                                                    <span>{achievement.type} - Rank: {achievement.rank}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
