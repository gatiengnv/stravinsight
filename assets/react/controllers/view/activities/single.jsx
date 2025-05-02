import React, {useEffect, useState} from "react";
import Map from "../../components/Map";
import Card from "../../components/Card";
import StatItem from "../../components/StatItem";
import Drawer from "../../components/Drawer";
import {
    faChartLine,
    faFire,
    faHeart,
    faLineChart,
    faLocationDot,
    faMap,
    faPersonRunning,
    faRulerHorizontal,
    faStopwatch,
    faTableCells
} from "@fortawesome/free-solid-svg-icons";
import Split from "../../components/Split";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SegmentEfforts from "../../components/SegmentEfforts";
import Graphics from "../../components/Graphics";

export default function ActivityDetails({activity, activityDetail, activityStream}) {
    const [activeTab, setActiveTab] = useState("map");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ["map", "segments", "splitsmetric", "charts"].includes(tab)) {
            setActiveTab(tab);
        }
    }, []);

    useEffect(() => {
        const url = new URL(window.location);
        url.searchParams.set('tab', activeTab);
        window.history.replaceState({}, '', url);
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    if (!activity) {
        return <div className="p-4 md:p-6">No activity data available</div>;
    }

    const activityDate = activity.startDateLocal && new Date(activity.startDateLocal);
    const formattedDate = activityDate && activityDate.toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    }) || '';
    const formattedTime = activityDate && activityDate.toLocaleTimeString(undefined, {
        hour: "numeric", minute: "2-digit",
    }) || '';

    const hasStats = activity.distance || activity.averagePace || activity.movingTime ||
        activity.totalElevationGain || (activityDetail && activityDetail.calories) ||
        activity.averageHeartrate;

    const hasMap = activityDetail && activityDetail.mapPolyline;
    const hasSegments = activityDetail && activityDetail.segmentEfforts && activityDetail.segmentEfforts.length > 0;
    const hasSplitsMetric = activityDetail && activityDetail.splitsMetric && activityDetail.splitsMetric.length > 0;
    const hasSplitsStandard = activityDetail && activityDetail.splitsStandard && activityDetail.splitsStandard.length > 0;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTab = urlParams.get('tab');

        if (!urlTab) {
            if (hasMap) handleTabChange('map');
            else if (hasSegments) handleTabChange('segments');
            else if (hasSplitsMetric) handleTabChange('splitsmetric');
            else if (hasSplitsStandard) handleTabChange('splitsstandard');
        }
    }, []);

    return (
        <Drawer>
            <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
                    <div className="flex items-center gap-3">
                        {activity.type === "Run" && <FontAwesomeIcon icon={faPersonRunning}/>}
                        <h1 className="text-2xl font-bold text-base-content">
                            {activity.name || 'Activité sans nom'}
                        </h1>
                    </div>
                    <div className="text-sm text-base-content opacity-80 text-left sm:text-right">
                        {formattedDate} {formattedTime && `at ${formattedTime}`}
                    </div>
                </div>

                {hasStats && (
                    <Card className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {activity.distance && (
                                <StatItem title="Distance" value={activity.distance + " km"} icon={faLocationDot}/>
                            )}
                            {activity.averagePace && (
                                <StatItem title="Avg Pace" value={activity.averagePace + " /km"}
                                          icon={faPersonRunning}/>
                            )}
                            {activity.movingTime && (
                                <StatItem title="Moving Time" value={activity.movingTime} icon={faStopwatch}/>
                            )}
                            {(activity.totalElevationGain > 0) && (
                                <StatItem title="Elevation Gain" value={activity.totalElevationGain + " m"}
                                          icon={faChartLine}/>
                            )}
                            {activityDetail && (activityDetail.calories > 0) && (
                                <StatItem title="Calories" value={activityDetail.calories} icon={faFire}/>
                            )}
                            {activity.averageHeartrate && (
                                <StatItem title="Avg Heart Rate" value={activity.averageHeartrate + " bpm"}
                                          icon={faHeart}/>
                            )}
                        </div>
                    </Card>
                )}

                {(hasMap || hasSegments || hasSplitsMetric || hasSplitsStandard) && (
                    <div className="mb-4">
                        <div className="tabs">
                            {hasMap && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'map' ? 'tab-active' : ''}`}
                                    onClick={() => handleTabChange('map')}
                                >
                                    <FontAwesomeIcon icon={faMap} className="mr-2"/> Map
                                </button>
                            )}
                            {hasSegments && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'segments' ? 'tab-active' : ''}`}
                                    onClick={() => handleTabChange('segments')}
                                >
                                    <FontAwesomeIcon icon={faRulerHorizontal} className="mr-2"/> Segments
                                </button>
                            )}
                            {hasSplitsMetric && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'splitsmetric' ? 'tab-active' : ''}`}
                                    onClick={() => handleTabChange('splitsmetric')}
                                >
                                    <FontAwesomeIcon icon={faTableCells} className="mr-2"/> Splits
                                </button>
                            )}
                            <button
                                className={`tab tab-bordered ${activeTab === 'charts' ? 'tab-active' : ''}`}
                                onClick={() => handleTabChange('charts')}
                            >
                                <FontAwesomeIcon icon={faLineChart} className="mr-2"/> Charts
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    {activeTab === 'map' && hasMap && (
                        <Card>
                            <Map
                                encodedPolyline={activityDetail.mapPolyline}
                                averagePace={activity.averagePace || ""}
                            />
                        </Card>
                    )}

                    {activeTab === 'segments' && hasSegments && (
                        <Card title="Segments Efforts">
                            <SegmentEfforts segmentEfforts={activityDetail.segmentEfforts}/>
                        </Card>
                    )}

                    {activeTab === 'splitsmetric' && hasSplitsMetric && (
                        <Card title="Splits">
                            <Split splitsMetric={activityDetail.splitsMetric}
                                   splitsStandard={activityDetail.splitsStandard}/>
                        </Card>
                    )}
                    {activeTab === 'charts' && activityStream && (
                        <Card title="Chart">
                            <Graphics activityStream={activityStream}/>
                        </Card>
                    )}
                </div>
            </div>
        </Drawer>
    );
}
