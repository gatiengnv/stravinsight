import React from "react";

export default function dashboard() {
  return (
      <div>
          <h1 className={"m-3"}>Dashboard</h1>
          <div className="stats shadow">
              <div className="stat">
                  <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                      </svg>

                  </div>
                  <div className="stat-title">Total Activities</div>
                  <div className="stat-value">127</div>
                  <div className="stat-desc">+5 from last month</div>
              </div>

              <div className="stat">
                  <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                      </svg>

                  </div>
                  <div className="stat-title">Total Distance</div>
                  <div className="stat-value">1,248 km</div>
                  <div className="stat-desc">+89 km from last month</div>
              </div>

              <div className="stat">
                  <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                      </svg>

                  </div>
                  <div className="stat-title">Total Time</div>
                  <div className="stat-value">87h 23m</div>
                  <div className="stat-desc">+7h from last month</div>
              </div>
              <div className="stat">
                  <div className="stat-figure text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                           stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
                          <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
                      </svg>
                  </div>
                  <div className="stat-title">Calories Burned</div>
                  <div className="stat-value">48,302</div>
                  <div className="stat-desc">+4,120 from last month</div>
              </div>
          </div>
          {/* name of each tab group should be unique */}
          <div className="tabs tabs-border">
              <input type="radio" name="my_tabs_2" className="tab" aria-label="Overview" />
              <div className="tab-content border-base-300 bg-base-100 p-10">Future Overview</div>

              <input type="radio" name="my_tabs_2" className="tab" aria-label="Analytics" defaultChecked />
              <div className="tab-content border-base-300 bg-base-100 p-10">Future Analytics</div>

              <input type="radio" name="my_tabs_2" className="tab" aria-label="Achievement" />
              <div className="tab-content border-base-300 bg-base-100 p-10">Future Achievement</div>
          </div>
      </div>
  );
}
