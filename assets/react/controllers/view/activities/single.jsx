import React, {useState} from "react";
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
import StandardSplits from "../../components/StandardSplit";
import Graphics from "../../components/Graphics";

export default function ActivityDetails({activity, activityDetail, activityStream}) {
    const [activeTab, setActiveTab] = useState('map');

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

    React.useEffect(() => {
        if (hasMap) setActiveTab('map');
        else if (hasSegments) setActiveTab('segments');
        else if (hasSplitsMetric) setActiveTab('splitsMetric');
        else if (hasSplitsStandard) setActiveTab('splitsStandard');
    }, [hasMap, hasSegments, hasSplitsMetric, hasSplitsStandard]);

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
                                    onClick={() => setActiveTab('map')}
                                >
                                    <FontAwesomeIcon icon={faMap} className="mr-2"/> Map
                                </button>
                            )}
                            {hasSegments && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'segments' ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab('segments')}
                                >
                                    <FontAwesomeIcon icon={faRulerHorizontal} className="mr-2"/> Segments
                                </button>
                            )}
                            {hasSplitsMetric && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'splitsMetric' ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab('splitsMetric')}
                                >
                                    <FontAwesomeIcon icon={faTableCells} className="mr-2"/> Splits (km)
                                </button>
                            )}
                            {hasSplitsStandard && (
                                <button
                                    className={`tab tab-bordered ${activeTab === 'splitsStandard' ? 'tab-active' : ''}`}
                                    onClick={() => setActiveTab('splitsStandard')}
                                >
                                    <FontAwesomeIcon icon={faTableCells} className="mr-2"/> Standard Splits
                                </button>
                            )}
                            <button
                                className={`tab tab-bordered ${activeTab === 'Charts' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('charts')}
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

                    {activeTab === 'splitsMetric' && hasSplitsMetric && (
                        <Card title="Splits (per km)">
                            <Split splitsMetric={activityDetail.splitsMetric}/>
                        </Card>
                    )}

                    {activeTab === 'splitsStandard' && hasSplitsStandard && (
                        <Card title="Standard Splits">
                            <StandardSplits splitsStandard={activityDetail.splitsStandard}/>
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
