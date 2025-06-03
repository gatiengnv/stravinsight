import {faBars, faFilter, faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DateRangePicker from "./DateRangePicker";
import React, {useState} from "react";
import SportPicker from "./SportPicker";

export default function Drawer({
                                   children,
                                   showDateRangePicker = false,
                                   showSportPicker = false,
                                   userSports = [],
                                   title = "",
                                   userProfileMedium = ""
                               }) {
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="drawer z-[9999]">
            <input id="my-drawer" type="checkbox" className="drawer-toggle"/>
            <div className="drawer-content">
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center">
                        <label htmlFor="my-drawer" className="btn mr-3">
                            <FontAwesomeIcon icon={faBars}/>
                        </label>
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>

                    {(showDateRangePicker || showSportPicker) && (
                        <div className="dropdown dropdown-end">
                            <button className="btn btn-primary" onClick={toggleFilters}>
                                <FontAwesomeIcon icon={faFilter}/>
                                <span className="ml-2">Filters</span>
                            </button>
                            {showFilters && (
                                <div
                                    className="dropdown-content z-[1] menu p-4 shadow bg-base-200 rounded-box w-80 mt-2">
                                    <div className="flex flex-col gap-4">
                                        {showDateRangePicker && (
                                            <div>
                                                <label className="font-medium mb-2 block">Date</label>
                                                <DateRangePicker/>
                                            </div>
                                        )}
                                        {showSportPicker && (
                                            <div>
                                                <label className="font-medium mb-2 block">Sports</label>
                                                <SportPicker userSports={userSports}/>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {children}
            </div>
            <div className="drawer-side z-[9999]">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="bg-base-200 text-base-content w-50 min-h-full flex flex-col">
                    <ul className="menu p-4 flex-1">
                        <li>
                            <a
                                href="/dashboard"
                                className={title === "Dashboard" ? "active bg-primary text-primary-content" : ""}
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href="/activities"
                                className={title === "Activities" ? "active bg-primary text-primary-content" : ""}
                            >
                                Activities
                            </a>
                        </li>
                        <li>
                            <a
                                href="/heatmap"
                                className={title === "Heatmap" ? "active bg-primary text-primary-content" : ""}
                            >
                                Heatmap
                            </a>
                        </li>
                        <li>
                            <a
                                href="/predict"
                                className={title === "Time Prediction" ? "active bg-primary text-primary-content" : ""}
                            >
                                Time prediction
                            </a>
                        </li>
                    </ul>
                    <ul className="p-4 mt-auto border-t border-base-300">
                        <li>
                            <div className="avatar">
                                <div
                                    className="ring-primary ring-offset-base-100 w-8 rounded-full ring-2 ring-offset-2 mr-3">
                                    <img src={userProfileMedium} alt="Profile"/>
                                </div>
                            </div>
                            <a href={"logout"}>
                                Logout
                                <FontAwesomeIcon icon={faRightFromBracket} className={"ml-2"}/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
