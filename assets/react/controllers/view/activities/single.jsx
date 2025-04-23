import React from "react";
import Map from "../../components/Map";
import Card from "../../components/Card";
import StatItem from "../../components/StatItem";
import {
    faChartLine,
    faFire,
    faHeart,
    faLocationDot,
    faPersonRunning,
    faStopwatch
} from "@fortawesome/free-solid-svg-icons";
import Split from "../../components/Split";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
        {km: 1, time: 340, hr: 145, elev_diff: 10},
        {km: 2, time: 345, hr: 150, elev_diff: 8},
        {km: 3, time: 342, hr: 152, elev_diff: 12},
        {km: 4, time: 348, hr: 155, elev_diff: 15},
        {km: 5, time: 340, hr: 158, elev_diff: 10},
        {km: 6, time: 345, hr: 160, elev_diff: 11},
        {km: 7, time: 350, hr: 162, elev_diff: 14},
        {km: 8, time: 342, hr: 165, elev_diff: 13},
        {km: 9, time: 338, hr: 168, elev_diff: 12},
        {km: 10, time: 335, hr: 170, elev_diff: 15},
        {km: 10.5, time: 175, hr: 172, elev_diff: 5},
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
export default function ActivityDetails({activity, activityDetail}) {
    const activityDate = new Date(activity.startDateLocal);
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
                    {activity.type === "Run" && (
                        <FontAwesomeIcon icon={faPersonRunning}/>
                    )}

                    <h1 className="text-2xl font-bold text-base-content">
                        {activity.name}
                    </h1>
                </div>
                <div className="text-sm text-base-content opacity-80 text-left sm:text-right">
                    {formattedDate} at {formattedTime}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow lg:w-2/3">
                    <Card title={"Route"} subtitle={""}>
                        <Map/>
                    </Card>
                </div>

                <div className="flex-shrink-0 lg:w-1/3">
                    <Card>
                        <StatItem title={"Distance"} value={activity.distance + " km"} icon={faLocationDot}/>
                        <StatItem title={"Avg Pace"}
                                  value={activity.averagePace + "/km"}
                                  icon={faPersonRunning}/>
                        <StatItem title={"Moving Time"} value={activity.movingTime} icon={faStopwatch}/>
                        <StatItem title={"Elevation Gain"} value={activity.totalElevationGain + " m"}
                                  icon={faChartLine}/>
                        <StatItem title={"Calories"} value={"550"} icon={faFire}/>
                        <StatItem title={"Avg Heart Rate"} value={activity.averageHeartrate + " bpm"} icon={faHeart}/>
                    </Card>
                    <Card title={"Splits (per km)"}>
                        <Split splitsMetric={activityDetail.splitsMetric}/>
                    </Card>
                </div>
            </div>
        </div>
    );
}
