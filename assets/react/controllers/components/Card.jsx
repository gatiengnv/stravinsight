import React from "react";

export default function Card({title = "", subtitle = "", children}) {
    return (
        <div className="card bg-neutral text-neutral-content p-4 md:p-6 flex-1 shadow-lg">
            <h2 className="card-title text-xl font-bold mb-1">
                {title}
            </h2>
            <p className="text-sm opacity-80 mb-4">{subtitle}</p>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
