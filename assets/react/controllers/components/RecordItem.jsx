import React from "react";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function RecordItem({title, date, success}) {
    return (
        <div className="flex justify-between items-center text-sm">
            <div>
                <div className="font-semibold">{title}</div>
                <div className="text-xs opacity-70">{date}</div>
            </div>
            <div className="text-right font-semibold flex items-center gap-1">
                <FontAwesomeIcon icon={faTrophy}/>
                <span>{success}</span>
            </div>
        </div>
    )
}
