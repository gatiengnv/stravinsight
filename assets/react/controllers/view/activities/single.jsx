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
import SegmentEfforts from "../../components/SegmentEfforts";
import StandardSplits from "../../components/StandardSplit";

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
                        <Map encodedPolyline={activityDetail.mapPolyline} averagePace={activity.averagePace}/>
                    </Card>
                    <Card title={"Segments Efforts"}>
                        <SegmentEfforts segmentEfforts={activityDetail.segmentEfforts}/>
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
                    <Card title={"Standard Splits"}>
                        <StandardSplits splitsStandard={activityDetail.splitsStandard}/>
                    </Card>
                </div>
            </div>
        </div>
    );
}
