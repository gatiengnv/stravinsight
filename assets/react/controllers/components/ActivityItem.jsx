import React from "react";

export default function ActivityItem({activity}) {
    const activityDate = activity.startDateLocal && new Date(activity.startDateLocal);
    const formattedDate = activityDate && activityDate.toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    }) || '';
    return (
        <a href={"/activities/" + activity.id}>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">{activity.name}</div>
                    <div className="text-xs opacity-70">{formattedDate}</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">{activity.distance}</div>
                    <div className="text-xs opacity-70">{activity.movingTime}</div>
                </div>
            </div>
        </a>
    );
}
