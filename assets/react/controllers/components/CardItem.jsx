import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function CardItem({icon, title, value, desc}) {
    return (
        <div className="stat">
            <div className="stat-figure text-secondary">
                <FontAwesomeIcon icon={icon} className={"text-primary-content"}/>
            </div>
            <div className="stat-title">{title}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-desc text-success">{desc}</div>
        </div>
    );
}
