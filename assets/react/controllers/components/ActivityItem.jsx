import React from "react";

export default function ActivityItem({activity}) {
    const activityDate = activity.startDateLocal && new Date(activity.startDateLocal);
    const formattedDate = activityDate?.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short",
    }) || '';

    return (
        <a href={"/activities/" + `${activity.id}` + "/initialize"}>
            <div className="p-3 border-b hover:bg-base-200 transition-colors">
                <div className="block md:hidden">
                    <div className="flex justify-between items-center mb-1">
                        <div className="badge badge-outline badge-success">{activity.type || "Run"}</div>
                        <div className="text-xs opacity-70">{formattedDate}</div>
                    </div>
                    <div className="font-medium mb-2">{activity.name}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center">
                        <div>
                            <span className="block opacity-70">Time</span>
                            <span>{activity.movingTime}</span>
                        </div>
                        <div>
                            <span className="block opacity-70">Distance</span>
                            <span>{activity.distance}</span>
                        </div>
                        <div>
                            <span className="block opacity-70">Elevation</span>
                            <span>{activity.totalElevationGain || "0"} m</span>
                        </div>
                    </div>
                </div>

                <div className="hidden md:grid md:grid-cols-6 md:items-center text-sm">
                    <div className="text-left badge badge-outline badge-success">{activity.type || "Run"}</div>
                    <div className="text-left">{formattedDate}</div>
                    <div className="text-left truncate col-span-2">{activity.name}</div>
                    <div className="text-right">{activity.movingTime}</div>
                    <div className="text-right flex items-center justify-end gap-3">
                        <span>{activity.distance}</span>
                        <span className="text-xs opacity-70">{activity.totalElevationGain || "0"} m</span>
                    </div>
                </div>
            </div>
        </a>
    );
}
