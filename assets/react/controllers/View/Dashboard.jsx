import React from "react";
import ActivityItem from "../components/ActivityItem";
import StatItem from "../components/StatItem";
import {faBolt, faClock, faFire, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import RecordItem from "../components/RecordItem";
import HearthRateZones from "../components/HearthRateZones";
import FitnessTrendItem from "../components/FitnessTrendItem";

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
                            <ActivityItem activity={
                                {
                                    name: "Morning Run",
                                    startDateLocal: "2023-10-01 07:30",
                                    distance: "5.2 km",
                                    movingTime: "30:15",
                                }
                            }/>
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
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <CyclingIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Century Ride</h3>
                                    <p className="text-xs opacity-80 mb-2">
                                        Complete a 100 km ride
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-success">Achieved</span>
                                        <span className="opacity-70">July 22, 2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <TrendingUpIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Marathon Finisher</h3>
                                    <p className="text-xs opacity-80 mb-2">Complete a marathon</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-success">Achieved</span>
                                        <span className="opacity-70">November 5, 2022</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <SunriseIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Early Bird</h3>
                                    <p className="text-xs opacity-80 mb-2">
                                        Complete 10 activities before 7 AM
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-success">Achieved</span>
                                        <span className="opacity-70">Ongoing (8/10)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <TrendingUpIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Elevation Gain</h3>
                                    <p className="text-xs opacity-80 mb-2">
                                        Climb 5,000 meters in a month
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-warning">
                      In Progress
                    </span>
                                        <span className="opacity-70">3,245m / 5,000m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <CalendarIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Consistent Runner</h3>
                                    <p className="text-xs opacity-80 mb-2">
                                        Run 3 times a week for 4 weeks
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-warning">
                      In Progress
                    </span>
                                        <span className="opacity-70">Week 2/4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder flex-shrink-0">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                                        <div className="flex justify-center items-center w-full h-full">
                                            <MapPinIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-semibold text-md">Explorer</h3>
                                    <p className="text-xs opacity-80 mb-2">
                                        Complete activities in 5 different cities
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-warning">
                      In Progress
                    </span>
                                        <span className="opacity-70">3/5 cities</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TrophyIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
        <path
            fillRule="evenodd"
            d="M11.25 3.75A.75.75 0 0 1 12 3h.75a.75.75 0 0 1 .75.75v2.035a.75.75 0 0 1-.33.63l-2.5 1.667a.75.75 0 0 1-.84-.002l-2.5-1.667a.75.75 0 0 1-.33-.63V4.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.19l.07-.046a.75.75 0 0 1 .84 0l.07.046V3.75Zm4.72 4.524a.75.75 0 0 1 .33.63v10.191a.75.75 0 0 1-.262.574l-2.956 2.464a.75.75 0 0 1-.966-.002l-2.956-2.464a.75.75 0 0 1-.262-.574V9.154a.75.75 0 0 1 .33-.63l2.5-1.667a.75.75 0 0 1 .84 0l2.5 1.667Zm-8.94-.002a.75.75 0 0 1 .84 0l2.5 1.667a.75.75 0 0 1 .33.63v10.191a.75.75 0 0 1-.262.574l-2.956 2.464a.75.75 0 0 1-.966-.002L4.513 19.92a.75.75 0 0 1-.262-.574V9.154a.75.75 0 0 1 .33-.63l2.5-1.667Z"
            clipRule="evenodd"
        />
    </svg>
);

const CyclingIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
        />
    </svg>
);

const TrendingUpIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
    </svg>
);

const SunriseIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
    </svg>
);

const CalendarIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
    </svg>
);

const MapPinIcon = ({className = ""}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={className}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
    </svg>
);
