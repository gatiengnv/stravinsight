import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function AchievementItem({icon, title, desc, achieved, date}) {
    return (
        <div className="card bg-neutral text-neutral-content p-4 shadow-md">
            <div className="flex items-start gap-4">
                <div className="avatar placeholder flex-shrink-0">
                    <div className="bg-orange-600 text-neutral-content rounded-full w-12 h-12">
                        <div className="flex justify-center items-center w-full h-full">
                            <FontAwesomeIcon icon={icon} className={"text-primary-content"}/>
                        </div>
                    </div>
                </div>

                <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-md">{title}</h3>
                    <p className="text-xs opacity-80 mb-2">
                        {desc}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                        {achieved ? (<span className="font-semibold text-success">Achieved</span>) : (
                            <span className="font-semibold text-warning">In Progress</span>)}
                        <span className="opacity-70">{date}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
