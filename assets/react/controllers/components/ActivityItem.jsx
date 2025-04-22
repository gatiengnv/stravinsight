import React from "react";

export default function ActivityItem({activity}) {
    return (
        <a href={"/activity/" + activity.id}>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">{activity.name}</div>
                    <div className="text-xs opacity-70">{activity.startDateLocal}</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">{activity.distance}</div>
                    <div className="text-xs opacity-70">{activity.movingTime}</div>
                </div>
            </div>
        </a>
    );
}
