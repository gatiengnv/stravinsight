import React, {useEffect, useState} from "react";
import ActivityItem from "../components/ActivityItem";
import StatItem from "../components/StatItem";
import Drawer from "../components/Drawer";
import {
    faArrows,
    faBolt,
    faBuilding,
    faCalendarCheck,
    faClock,
    faEarth,
    faGaugeHigh,
    faKiwiBird,
    faLocationDot,
    faMoon,
    faMountain,
    faMountainCity,
    faMultiply,
    faPersonBiking,
    faPersonRunning,
    faRunning
} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import RecordItem from "../components/RecordItem";
import HearthRateZones from "../components/HearthRateZones";
import FitnessTrend from "../components/FitnessTrend";
import AchievementItem from "../components/AchievementItem";
import WeeklyDistanceChart from "../components/WeeklyDistanceChart";
import ActivityPieChart from "../components/ActivityPieChart";

export default function Dashboard({
                                      stats = 0,
                                      activityDifference,
                                      activities,
                                      records,
                                      hearthRatePercentage,
                                      fitnessTrend,
                                      achievements,
                                      weeklyDistance,
                                      activityCountBySport,
                                      userSports,
                                      userProfileMedium
                                  }) {
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab && ["overview", "analytics", "achievements"].includes(tab)) {
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

    return (
        <Drawer title={"Dashboard"} showDateRangePicker={true} showSportPicker={true} userSports={userSports}
                userProfileMedium={userProfileMedium}>
            <div className="p-4 md:p-6">
                <div className="stats stats-vertical md:grid-cols-2 lg:grid-cols-3 xl:stats-horizontal shadow w-full">
                    <StatItem icon={faBolt} title={"Total Activities"} value={stats.totalActivities}
                              desc={(activityDifference.activityDifference > 0 ? "+" : "") + activityDifference.activityDifference + " from last month"}/>
                    <StatItem icon={faLocationDot} title={"Total Distance"} value={stats.totalDistance + " km"}
                              desc={(activityDifference.distanceDifference > 0 ? "+" : "") + activityDifference.distanceDifference + " from last month"}/>
                    <StatItem icon={faClock} title={"Total Time"} value={stats.totalTime}
                              desc={(activityDifference.timeDifference > 0 ? "+" : "") + activityDifference.timeDifference + " from last month"}/>
                    <StatItem icon={faGaugeHigh} title={"Average speed"} value={stats.averageSpeed}
                              desc={(activityDifference.speedDifference > 0 ? "+" : "") + activityDifference.speedDifference + " from last month"}/>
                </div>

                <div className="tabs tabs-bordered">
                    <input
                        type="radio"
                        id="tab-overview"
                        name="my_tabs_2"
                        className="tab"
                        aria-label="Overview"
                        checked={activeTab === "overview"}
                        onChange={() => handleTabChange("overview")}
                    />

                    <div
                        role="tabpanel"
                        className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-2/3">
                                <Card title={"Recent Activities"} subtitle={"Your last 7 activities"}>
                                    {activities.map((activity, index) => (
                                        <ActivityItem key={index} activity={activity}/>
                                    ))}
                                    <div className="mt-4 text-center">
                                        <a href="/activities" className="btn btn-primary">See All Activities</a>
                                    </div>
                                </Card>
                            </div>

                            <div className="lg:w-1/3">
                                <Card title={"Personal Records"} subtitle={"Your best performances"}>
                                    {records.map((record, index) => (
                                        <RecordItem key={index} record={record}/>
                                    ))}
                                </Card>
                            </div>
                        </div>
                    </div>

                    <input
                        type="radio"
                        id="tab-analytics"
                        name="my_tabs_2"
                        className="tab"
                        aria-label="Analytics"
                        checked={activeTab === "analytics"}
                        onChange={() => handleTabChange("analytics")}
                    />

                    <div
                        role="tabpanel"
                        className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title={"Heart Rate Zones"} subtitle={"Time spent in each zone"}>
                                <HearthRateZones hearthRatePercentage={hearthRatePercentage}/>
                            </Card>
                            <Card title={"Fitness Trend"} subtitle={"Your fitness level over time"}>
                                <FitnessTrend heights={fitnessTrend}/>
                            </Card>
                            <Card title={"Weekly Distance"} subtitle={"Your weekly distance over time"}>
                                <WeeklyDistanceChart weeklyDistance={weeklyDistance}/>
                            </Card>
                            <Card>
                                <ActivityPieChart activityCountBySport={activityCountBySport}/>
                            </Card>
                        </div>
                    </div>

                    <input
                        type="radio"
                        id="tab-achievements"
                        name="my_tabs_2"
                        className="tab"
                        aria-label="Achievements"
                        checked={activeTab === "achievements"}
                        onChange={() => handleTabChange("achievements")}
                    />

                    <div
                        role="tabpanel"
                        className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => {
                                const icons = [faPersonBiking, faPersonRunning, faArrows, faRunning, faKiwiBird, faMountain, faBolt, faBuilding, faEarth, faMountainCity, faMoon, faCalendarCheck, faMultiply];
                                return (
                                    <AchievementItem key={index} icon={icons[index]} achievement={achievement}/>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
