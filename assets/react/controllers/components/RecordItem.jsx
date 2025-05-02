import React from "react";
import {faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function RecordItem({record}) {
    const recordDate = record.date && new Date(record.date);
    const formattedDate = recordDate && recordDate.toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
    }) || '';
    return (
        <div className="flex justify-between items-center text-sm">
            <div>
                <div className="font-semibold">{record.name}</div>
                <div className="text-xs opacity-70">{formattedDate}</div>
            </div>
            <div className="text-right font-semibold flex items-center gap-1">
                <FontAwesomeIcon icon={faTrophy}/>
                <span>{record.value}</span>
            </div>
        </div>
    )
}
