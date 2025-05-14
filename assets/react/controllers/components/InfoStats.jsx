import React from "react";

export default function InfoStats({activitiesCount}) {
    return (
        <div className="mt-4 p-2 text-center text-sm opacity-70">
            <p>Hover over a route to see activity details, click to view details</p>
            <p className="mt-2">Total: {activitiesCount} activities</p>
        </div>
    );
}
