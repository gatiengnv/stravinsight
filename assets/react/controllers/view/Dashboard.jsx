import React from "react";
import ActivityItem from "../components/ActivityItem";
import StatItem from "../components/StatItem";
import {
    faBiking,
    faBolt,
    faCalendar,
    faCity,
    faClock,
    faFire,
    faLocationDot,
    faMountain,
    faPersonRunning,
    faSun
} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import RecordItem from "../components/RecordItem";
import HearthRateZones from "../components/HearthRateZones";
import FitnessTrendItem from "../components/FitnessTrendItem";
import AchievementItem from "../components/AchievementItem";

export default function Dashboard() {
    return (
        <div className="p-4 md:p-6">
            <h1 className={"m-3 text-2xl font-bold"}>Dashboard</h1>

            <div className="stats stats-vertical lg:stats-horizontal shadow mb-6 w-full">
                <StatItem icon={faBolt} title={"Total Activities"} value={127} desc={"+5 from last month"}/>
                <StatItem icon={faLocationDot} title={"Total Distance"} value={"1,248 km"}
                          desc={"+89 km from last month"}/>
                <StatItem icon={faClock} title={"Total Time"} value={"87h 23m"} desc={"+7h from last month"}/>
                <StatItem icon={faFire} title={"Calories Burned"} value={"48,302"} desc={"+4,120 from last month"}/>
            </div>

            <div className="tabs tabs-bordered">
                <input
                    type="radio"
                    id="tab-overview"
                    name="my_tabs_2"
                    className="tab"
                    aria-label="Overview"
                    defaultChecked
                />

                <div
                    role="tabpanel"
                    className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        <Card title={"Recent Activities"} subtitle={"Your last 5 activities"}>
                            <ActivityItem activity={{
                                name: "Morning Run",
                                startDateLocal: "2023-10-01 07:30",
                                distance: "5.2 km",
                                movingTime: "30:15",
                            }}/>
                            <div className="mt-4 text-center">
                                <a href="/activity" className="btn btn-primary">See All Activities</a>
                            </div>
                        </Card>

                        <Card title={"Personal Records"} subtitle={"Your best performances"}>
                            <RecordItem title={"5K"} date={"May 12, 2023"} success={"22:15"}></RecordItem>
                            <RecordItem title={"10K"} date={"May 12, 2023"} success={"48:32"}></RecordItem>
                            <RecordItem title={"Half Marathon"} date={"May 12, 2023"} success={"1:52:45"}></RecordItem>
                            <RecordItem title={"Marathon"} date={"May 12, 2023"} success={"4:05:18"}></RecordItem>
                            <RecordItem title={"Longest Ride"} date={"May 12, 2023"} success={"120.5 km"}></RecordItem>
                        </Card>
                    </div>
                </div>

                <input
                    type="radio"
                    id="tab-analytics"
                    name="my_tabs_2"
                    className="tab"
                    aria-label="Analytics"
                />

                <div
                    role="tabpanel"
                    className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                >
                    <div className="flex flex-col lg:flex-row gap-6">
                        <Card title={"Heart Rate Zones"} subtitle={"Time spent in each zone"}>
                            <HearthRateZones zones1percentage={25} zones2percentage={45} zones3percentage={20}
                                             zones4percentage={8} zones5percentage={2}/>
                        </Card>

                        <Card title={"Fitness Trend"} subtitle={"Your fitness level over time"}>
                            <FitnessTrendItem
                                heights={["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]}
                                period={"Last 12 weeks"} isImproving={true}/>
                        </Card>
                    </div>
                </div>

                <input
                    type="radio"
                    id="tab-achievements"
                    name="my_tabs_2"
                    className="tab"
                    aria-label="Achievements"
                />

                <div
                    role="tabpanel"
                    className="tab-content bg-base-200 border-base-300 rounded-box p-4 md:p-6 text-base-content mt-[-1px]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AchievementItem icon={faBiking} title={"Century Ride"} desc={"Complete a 100 km ride"}
                                         achieved={true} date={"July 22, 2023"}/>
                        <AchievementItem icon={faPersonRunning} title={"Marathon Finisher"} desc={"Complete a marathon"}
                                         achieved={true} date={"November 5, 2022"}/>
                        <AchievementItem icon={faSun} title={"Early Bird"}
                                         desc={"Complete 10 activities before 7 AM"} achieved={false}
                                         date={"Ongoing (8/10)"}/>
                        <AchievementItem icon={faMountain} title={"Elevation Gain"}
                                         desc={"Climb 5,000 meters in a month"} achieved={false}
                                         date={"3,245m / 5,000m"}/>
                        <AchievementItem icon={faCalendar} title={"Consistent Runner"}
                                         desc={"Run 3 times a week for 4 weeks"} achieved={false} date={"Week 2/4"}/>
                        <AchievementItem icon={faCity} title={"Explorer"}
                                         desc={"Complete activities in 5 different cities"} achieved={false}
                                         date={"3/5 cities"}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
