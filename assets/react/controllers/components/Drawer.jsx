import {faBars, faFilter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DateRangePicker from "./DateRangePicker";
import React, {useState} from "react";
import SportPicker from "./SportPicker";

export default function Drawer({
                                   children,
                                   showDateRangePicker = false,
                                   showSportPicker = false,
                                   userSports = [],
                                   title = ""
                               }) {
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="drawer">
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
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
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
                </ul>
            </div>
        </div>
    )
}
