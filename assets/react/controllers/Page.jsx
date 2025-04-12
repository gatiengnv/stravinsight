import React from "react";
import {LucideTrophy} from "lucide-react";

export default function dashboard() {
    return (
        <div className="p-4 md:p-6">
            <h1 className={"m-3 text-2xl font-bold"}>Dashboard</h1>
            <div className="stats shadow mb-6 w-full">

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                    <div className="stat-title">Total Activities</div>
                    <div className="stat-value">127</div>
                    <div className="stat-desc text-success">+5 from last month</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                        </svg>
                    </div>
                    <div className="stat-title">Total Distance</div>
                    <div className="stat-value">1,248 km</div>
                    <div className="stat-desc text-success">+89 km from last month</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    </div>
                    <div className="stat-title">Total Time</div>
                    <div className="stat-value">87h 23m</div>
                    <div className="stat-desc text-success">+7h from last month</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
                        </svg>
                    </div>
                    <div className="stat-title">Calories Burned</div>
                    <div className="stat-value">48,302</div>
                    <div className="stat-desc text-success">+4,120 from last month</div>
                </div>
            </div>


            <div className="tabs tabs-bordered">
                <input type="radio" id="tab-overview" name="my_tabs_2" className="tab" aria-label="Overview" defaultChecked />
                <div role="tabpanel" className="tab-content bg-base-200 border-base-300 rounded-box p-6 text-base-content">

                    <div className="flex flex-col lg:flex-row gap-6">


                        <div className="card bg-neutral text-neutral-content p-6 flex-1 shadow-lg">
                            <h2 className="card-title text-xl font-bold mb-1">Recent Activities</h2>
                            <p className="text-sm opacity-80 mb-4">Your last 5 activities</p>
                            <div className="space-y-4">

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Morning Run</div>
                                        <div className="text-xs opacity-70">Today</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">5.2 km</div>
                                        <div className="text-xs opacity-70">28:45</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Evening Ride</div>
                                        <div className="text-xs opacity-70">Yesterday</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">12.7 km</div>
                                        <div className="text-xs opacity-70">42:18</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Trail Run</div>
                                        <div className="text-xs opacity-70">2 days ago</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">8.4 km</div>
                                        <div className="text-xs opacity-70">52:30</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Recovery Ride</div>
                                        <div className="text-xs opacity-70">3 days ago</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">15.3 km</div>
                                        <div className="text-xs opacity-70">55:12</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Long Run</div>
                                        <div className="text-xs opacity-70">5 days ago</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">18.6 km</div>
                                        <div className="text-xs opacity-70">1:45:22</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-6 flex-1 shadow-lg">
                            <h2 className="card-title text-xl font-bold mb-1">Personal Records</h2>
                            <p className="text-sm opacity-80 mb-4">Your best performances</p>
                            <div className="space-y-4">

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">5K</div>
                                        <div className="text-xs opacity-70">May 12, 2023</div>
                                    </div>
                                    <div className="text-right font-semibold flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-warning" />
                                        <span>22:15</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">10K</div>
                                        <div className="text-xs opacity-70">April 3, 2023</div>
                                    </div>
                                    <div className="text-right font-semibold flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-warning" />
                                        <span>48:32</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Half Marathon</div>
                                        <div className="text-xs opacity-70">March 15, 2023</div>
                                    </div>
                                    <div className="text-right font-semibold flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-warning" />
                                        <span>1:52:45</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Marathon</div>
                                        <div className="text-xs opacity-70">November 5, 2022</div>
                                    </div>
                                    <div className="text-right font-semibold flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-warning" />
                                        <span>4:05:18</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-semibold">Longest Ride</div>
                                        <div className="text-xs opacity-70">July 22, 2023</div>
                                    </div>
                                    <div className="text-right font-semibold flex items-center gap-1">
                                        <TrophyIcon className="w-4 h-4 text-warning" />
                                        <span>120.5 km</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <input type="radio" id="tab-analytics" name="my_tabs_2" className="tab" aria-label="Analytics" />
                <div role="tabpanel" className="tab-content bg-base-200 border-base-300 rounded-box p-6 text-base-content">

                    <div className="flex flex-col lg:flex-row gap-6">


                        <div className="card bg-neutral text-neutral-content p-6 flex-1 shadow-lg">
                            <h2 className="card-title text-xl font-bold mb-1">Heart Rate Zones</h2>
                            <p className="text-sm opacity-80 mb-4">Time spent in each zone</p>
                            <div className="space-y-3">

                                <div className="flex items-center gap-3">
                                  <span className="flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                      </svg>
                                  </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Zone 1 (Recovery)</span>
                                            <span className="font-semibold">25%</span>
                                        </div>
                                        <progress className="progress progress-success w-full h-2" value="25" max="100"></progress>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                      </svg>
                                  </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Zone 2 (Endurance)</span>
                                            <span className="font-semibold">45%</span>
                                        </div>
                                        <progress className="progress progress-info w-full h-2" value="45" max="100"></progress>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="flex-shrink-0">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                      </svg>
                                  </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Zone 3 (Tempo)</span>
                                            <span className="font-semibold">20%</span>
                                        </div>
                                        <progress className="progress progress-warning w-full h-2" value="20" max="100"></progress>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                   <span className="flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                      </svg>
                                   </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Zone 4 (Threshold)</span>
                                            <span className="font-semibold">8%</span>
                                        </div>
                                        <progress className="progress progress-error w-full h-2" value="8" max="100"></progress>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="flex-shrink-0">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                           <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                      </svg>
                                  </span>
                                    <div className="flex-grow">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Zone 5 (VO2 Max)</span>
                                            <span className="font-semibold">2%</span>
                                        </div>
                                        <progress className="progress progress-error w-full h-2" value="2" max="100"></progress>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-6 flex-1 shadow-lg">
                            <h2 className="card-title text-xl font-bold mb-1">Fitness Trend</h2>
                            <p className="text-sm opacity-80 mb-4">Your fitness level over time</p>
                            <div className="flex items-end justify-center gap-1.5 h-48 mb-4 px-4">

                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '25%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '35%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '40%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '50%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '55%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '65%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '70%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '78%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '85%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '88%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '92%' }}></div>
                                <div className="bg-orange-500 w-4 rounded-t-sm" style={{ height: '98%' }}></div>
                            </div>
                            <div className="text-center text-sm flex items-center justify-center gap-2">
                                <span className="opacity-80">Last 12 weeks</span>
                                <span className="text-success flex items-center gap-1 font-semibold">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                  </svg>
                                  Improving
                              </span>
                            </div>
                        </div>

                    </div>

                </div>

                <input type="radio" id="tab-achievements" name="my_tabs_2" className="tab" aria-label="Achievements"/>
                <div role="tabpanel" className="tab-content bg-base-200 border-base-300 rounded-box p-6 text-base-content">

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                            <CyclingIcon className="w-6 h-6" />
                                        </div>
                                        </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-md">Century Ride</h3>
                                    <p className="text-xs opacity-80 mb-2">Complete a 100 km ride</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-success">Achieved</span>
                                        <span className="opacity-70">July 22, 2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                            <TrendingUpIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
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
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                            <SunriseIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-md">Early Bird</h3>
                                    <p className="text-xs opacity-80 mb-2">Complete 10 activities before 7 AM</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-success">Achieved</span>
                                        <span className="opacity-70">Ongoing (8/10)</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                            <TrendingUpIcon className="w-6 h-6"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-md">Elevation Gain</h3>
                                    <p className="text-xs opacity-80 mb-2">Climb 5,000 meters in a month</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-warning">In Progress</span>
                                        <span className="opacity-70">3,245m / 5,000m</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-md">Consistent Runner</h3>
                                    <p className="text-xs opacity-80 mb-2">Run 3 times a week for 4 weeks</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-warning">In Progress</span>
                                        <span className="opacity-70">Week 2/4</span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="avatar placeholder">
                                    <div className="bg-orange-600 text-neutral-content rounded-full w-12">
                                        <div className={"flex justify-center items-center m-3"}>
                                         <MapPinIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-md">Explorer</h3>
                                    <p className="text-xs opacity-80 mb-2">Complete activities in 5 different cities</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-semibold text-warning">In Progress</span>
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

const TrophyIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.25 3.75A.75.75 0 0 1 12 3h.75a.75.75 0 0 1 .75.75v2.035a.75.75 0 0 1-.33.63l-2.5 1.667a.75.75 0 0 1-.84-.002l-2.5-1.667a.75.75 0 0 1-.33-.63V4.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.19l.07-.046a.75.75 0 0 1 .84 0l.07.046V3.75Zm4.72 4.524a.75.75 0 0 1 .33.63v10.191a.75.75 0 0 1-.262.574l-2.956 2.464a.75.75 0 0 1-.966-.002l-2.956-2.464a.75.75 0 0 1-.262-.574V9.154a.75.75 0 0 1 .33-.63l2.5-1.667a.75.75 0 0 1 .84 0l2.5 1.667Zm-8.94-.002a.75.75 0 0 1 .84 0l2.5 1.667a.75.75 0 0 1 .33.63v10.191a.75.75 0 0 1-.262.574l-2.956 2.464a.75.75 0 0 1-.966-.002L4.513 19.92a.75.75 0 0 1-.262-.574V9.154a.75.75 0 0 1 .33-.63l2.5-1.667Z" clipRule="evenodd" />
    </svg>
);

const CyclingIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
);

const TrendingUpIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const SunriseIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

const CalendarIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
);

const MapPinIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);
