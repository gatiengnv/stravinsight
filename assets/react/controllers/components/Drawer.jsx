import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DateRangePicker from "./DateRangePicker";
import React from "react";

export default function Drawer({children, showDateRangePicker = false, title = ""}) {
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
                    {showDateRangePicker && (<DateRangePicker/>)}
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
