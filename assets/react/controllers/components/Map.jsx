import React from "react";
import {faMap} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Map() {
    return (
        <div className="aspect-video bg-base-300 rounded-box flex items-center justify-center">
            <div className="text-center p-4">
                <FontAwesomeIcon icon={faMap}/>
                <p className="text-sm opacity-60">Map Area Placeholder</p>
            </div>
        </div>
    )
}
