import React, {useEffect, useState} from "react";
import Drawer from "../components/Drawer";
import HeatmapControls from "../components/HeatmapControls";
import ActivityMap from "../components/ActivityMap";
import InfoStats from "../components/InfoStats";

export default function Heatmap({activities}) {
    const [filter, setFilter] = useState("all");
    const [heatmapMode, setHeatmapMode] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlFilter = urlParams.get('filter');
        const urlMode = urlParams.get('mode');

        if (urlFilter && ["all", "recent", "old"].includes(urlFilter)) {
            setFilter(urlFilter);
        }

        if (urlMode === "heatmap" || urlMode === "route") {
            setHeatmapMode(urlMode === "heatmap");
        }
    }, []);

    useEffect(() => {
        const url = new URL(window.location);
        url.searchParams.set('filter', filter);
        url.searchParams.set('mode', heatmapMode ? "heatmap" : "route");
        window.history.replaceState({}, '', url);
    }, [filter, heatmapMode]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const toggleHeatmapMode = () => {
        setHeatmapMode(prev => !prev);
    };

    return (
        <Drawer title="Heatmap">
            <HeatmapControls
                filter={filter}
                onFilterChange={handleFilterChange}
                heatmapMode={heatmapMode}
                onToggleHeatmapMode={toggleHeatmapMode}
            />
            <ActivityMap
                activities={activities}
                filter={filter}
                heatmapMode={heatmapMode}
            />
            <InfoStats activitiesCount={activities.length}/>
        </Drawer>
    );
}
