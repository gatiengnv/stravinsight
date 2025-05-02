import React, {useEffect, useRef, useState} from "react";
import Drawer from "../components/Drawer";
import polyline from "@mapbox/polyline";

export default function Heatmap({activities}) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const polylineRefs = useRef([]);
    const infoWindowRef = useRef(null);
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

    useEffect(() => {
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API is not loaded");
            return;
        }

        const map = new window.google.maps.Map(mapRef.current, {
            center: {lat: 48.8566, lng: 2.3522},
            zoom: 12,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
        });

        mapInstanceRef.current = map;
        const bounds = new window.google.maps.LatLngBounds();
        polylineRefs.current = [];

        infoWindowRef.current = new window.google.maps.InfoWindow();
        infoWindowRef.current.currentPolyline = null;

        let activitiesToShow = [...activities];
        if (filter === "recent") {
            activitiesToShow = activities
                .slice()
                .sort((a, b) => new Date(b.startDateLocal) - new Date(a.startDateLocal))
                .slice(0, 10);
        } else if (filter === "old") {
            activitiesToShow = activities
                .slice()
                .sort((a, b) => new Date(a.startDateLocal) - new Date(b.startDateLocal))
                .slice(0, 10);
        }

        activitiesToShow.forEach((activity, index) => {
            if (activity.summaryPolyline) {
                const decodedPath = polyline.decode(activity.summaryPolyline);
                const googlePath = decodedPath.map(([lat, lng]) => ({lat, lng}));

                googlePath.forEach(point => bounds.extend(point));

                const activityPath = new window.google.maps.Polyline({
                    path: googlePath,
                    geodesic: true,
                    strokeColor: heatmapMode ? "#FC4C02" : getActivityColor(index),
                    strokeOpacity: heatmapMode ? 0.5 : 0.7,
                    strokeWeight: 3,
                    zIndex: 1
                });

                activityPath.activity = activity;

                activityPath.addListener("mouseover", (event) => {
                    if (infoWindowRef.current) {
                        infoWindowRef.current.close();
                    }

                    activityPath.setOptions({
                        strokeWeight: 5,
                        strokeOpacity: 1,
                        zIndex: 100
                    });

                    infoWindowRef.current.currentPolyline = activityPath;
                    showInfoWindow(activity, event.latLng, map, activityPath);
                });

                activityPath.addListener("click", (event) => {
                    if (event && event.stop) {
                        event.stop();
                    }

                    if (activity && activity.id) {
                        window.location.href = `/activities/${activity.id}`;
                    } else {
                        console.error("Missing activity id:", activity);
                    }
                });

                activityPath.addListener("mouseout", () => {
                    if (!infoWindowRef.current || infoWindowRef.current.currentPolyline !== activityPath) {
                        activityPath.setOptions({
                            strokeWeight: 3,
                            strokeOpacity: heatmapMode ? 0.5 : 0.7,
                            zIndex: 1
                        });
                    }
                });

                activityPath.setMap(map);
                polylineRefs.current.push(activityPath);
            }
        });

        map.addListener("click", () => {
            polylineRefs.current.forEach(line => {
                line.setOptions({
                    strokeWeight: 3,
                    strokeOpacity: heatmapMode ? 0.5 : 0.7,
                    zIndex: 1
                });
            });

            if (infoWindowRef.current) {
                infoWindowRef.current.close();
                infoWindowRef.current.currentPolyline = null;
            }
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
        }

        return () => {
            polylineRefs.current.forEach(polyline => {
                if (polyline) polyline.setMap(null);
            });
            if (infoWindowRef.current) {
                infoWindowRef.current.close();
            }
        };
    }, [activities, filter, heatmapMode]);

    const getActivityColor = (index) => {
        const colors = [
            "#FC4C02", "#1E88E5", "#43A047", "#E53935", "#8E24AA",
            "#3949AB", "#039BE5", "#00897B", "#7CB342", "#C0CA33"
        ];
        return colors[index % colors.length];
    };

    const showInfoWindow = (activity, position, map, polyline) => {
        const dateOptions = {year: 'numeric', month: 'short', day: 'numeric'};
        const formattedDate = new Date(activity.startDateLocal).toLocaleDateString(undefined, dateOptions);

        const content = `
    <div class="p-2" style="color: black;">
        <strong>${activity.name}</strong><br/>
        <div class="mt-1">
            Distance: ${activity.distance}<br/>
            Date: ${formattedDate}
        </div>
    </div>
`;

        infoWindowRef.current.setContent(content);
        infoWindowRef.current.setPosition(position);
        infoWindowRef.current.open(map);
        infoWindowRef.current.currentPolyline = polyline;
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const toggleHeatmapMode = () => {
        setHeatmapMode(prev => !prev);
    };

    return (
        <Drawer title="Heatmap">
            <div className="mb-4 p-2">
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                    <button
                        onClick={() => handleFilterChange("all")}
                        className={`btn btn-sm md:btn-md ${filter === "all" ? "btn-primary" : "btn-outline"}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleFilterChange("recent")}
                        className={`btn btn-sm md:btn-md ${filter === "recent" ? "btn-primary" : "btn-outline"}`}
                    >
                        10 recent
                    </button>
                    <button
                        onClick={() => handleFilterChange("old")}
                        className={`btn btn-sm md:btn-md ${filter === "old" ? "btn-primary" : "btn-outline"}`}
                    >
                        10 oldest
                    </button>
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={toggleHeatmapMode}
                        className={`btn btn-sm md:btn-md ${heatmapMode ? "btn-accent" : "btn-outline"}`}
                    >
                        {heatmapMode ? "Route Colors" : "Heat Map"}
                    </button>
                </div>
            </div>
            <div
                ref={mapRef}
                className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[300px] bg-base-300 rounded-box"
            ></div>
            <div className="mt-4 p-2 text-center text-sm opacity-70">
                <p>Hover over a route to see activity details, click to view details</p>
                <p className="mt-2">Total: {activities.length} activities</p>
            </div>
        </Drawer>
    );
}
