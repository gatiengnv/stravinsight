import React from "react";

export default function HeatmapControls({filter, onFilterChange, heatmapMode, onToggleHeatmapMode}) {
    return (
        <div className="mb-4 p-2">
            <div className="flex flex-wrap justify-center gap-2 mb-2">
                <button
                    onClick={() => onFilterChange("all")}
                    className={`btn btn-sm md:btn-md ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                >
                    All
                </button>
                <button
                    onClick={() => onFilterChange("recent")}
                    className={`btn btn-sm md:btn-md ${filter === "recent" ? "btn-primary" : "btn-outline"}`}
                >
                    10 recent
                </button>
                <button
                    onClick={() => onFilterChange("old")}
                    className={`btn btn-sm md:btn-md ${filter === "old" ? "btn-primary" : "btn-outline"}`}
                >
                    10 oldest
                </button>
            </div>
            <div className="flex justify-center mt-2">
                <button
                    onClick={onToggleHeatmapMode}
                    className={`btn btn-sm md:btn-md ${heatmapMode ? "btn-accent" : "btn-outline"}`}
                >
                    {heatmapMode ? "Route Colors" : "Heat Map"}
                </button>
            </div>
        </div>
    );
}
