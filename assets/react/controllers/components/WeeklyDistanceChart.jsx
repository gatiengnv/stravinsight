import React, {useMemo, useState} from "react";
import Chart from "react-apexcharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine} from "@fortawesome/free-solid-svg-icons";

export default function WeeklyDistanceChart({weeklyDistance}) {
    const [activeMetric, setActiveMetric] = useState("distance");

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    };

    const metrics = useMemo(() => ({
        distance: {
            name: "Distance (km)",
            color: "#f97316",
            data: weeklyDistance.map(week => week.distance),
            unit: "km",
            calculateAverage: () => weeklyDistance.reduce((sum, week) => sum + week.distance, 0) / weeklyDistance.length,
            isImproving: () => {
                const first3Weeks = weeklyDistance.slice(0, 3).reduce((sum, week) => sum + week.distance, 0);
                const last3Weeks = weeklyDistance.slice(-3).reduce((sum, week) => sum + week.distance, 0);
                return last3Weeks > first3Weeks;
            }
        },
        elevation: {
            name: "Elevation (m)",
            color: "#10b981",
            data: weeklyDistance.map(week => week.elevation),
            unit: "m",
            calculateAverage: () => weeklyDistance.reduce((sum, week) => sum + week.elevation, 0) / weeklyDistance.length,
            isImproving: () => {
                const first3Weeks = weeklyDistance.slice(0, 3).reduce((sum, week) => sum + week.elevation, 0);
                const last3Weeks = weeklyDistance.slice(-3).reduce((sum, week) => sum + week.elevation, 0);
                return last3Weeks > first3Weeks;
            }
        },
        time: {
            name: "Time",
            color: "#3b82f6",
            data: weeklyDistance.map(week => Math.round(week.time / 60)),
            unit: "min",
            calculateAverage: () => weeklyDistance.reduce((sum, week) => sum + week.time, 0) / weeklyDistance.length / 60,
            isImproving: () => {
                const first3Weeks = weeklyDistance.slice(0, 3).reduce((sum, week) => sum + week.time, 0);
                const last3Weeks = weeklyDistance.slice(-3).reduce((sum, week) => sum + week.time, 0);
                return last3Weeks > first3Weeks;
            }
        }
    }), [weeklyDistance]);

    const currentMetric = useMemo(() => metrics[activeMetric], [metrics, activeMetric]);
    const averageValue = useMemo(() => currentMetric.calculateAverage().toFixed(1), [currentMetric]);
    const isImproving = useMemo(() => currentMetric.isImproving(), [currentMetric]);

    const chartConfig = {
        type: "line",
        height: 240,
        series: [
            {
                name: currentMetric.name,
                data: currentMetric.data,
            },
        ],
        options: {
            chart: {
                toolbar: {
                    show: false,
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                },
            },
            dataLabels: {
                enabled: false,
            },
            colors: [currentMetric.color],
            stroke: {
                lineCap: "round",
                curve: "smooth",
                width: 3,
                colors: [currentMetric.color],
            },
            markers: {
                size: 0,
                hover: {
                    size: 5,
                    sizeOffset: 3,
                }
            },
            xaxis: {
                axisTicks: {
                    show: false,
                },
                axisBorder: {
                    show: false,
                },
                labels: {
                    style: {
                        colors: "#ffffff",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
                categories: weeklyDistance.map(week => week.label),
            },
            yaxis: {
                labels: {
                    formatter: (value) => activeMetric === "time"
                        ? formatTime(value * 60)
                        : `${value} ${currentMetric.unit}`,
                    style: {
                        colors: "#ffffff",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        fontWeight: 400,
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 5,
                    right: 20,
                },
            },
            fill: {
                opacity: 0.5,
                type: "solid",
                colors: [currentMetric.color],
            },
            tooltip: {
                theme: "dark",
                y: {
                    formatter: (value) => activeMetric === "time"
                        ? formatTime(value * 60)
                        : `${value} ${currentMetric.unit}`,
                },
            },
            annotations: {
                yaxis: [
                    {
                        y: parseFloat(averageValue),
                        borderColor: currentMetric.color,
                        borderWidth: 1,
                        borderDash: [5, 5],
                        label: {
                            text: `Average: ${activeMetric === "time" ? formatTime(averageValue * 60) : `${averageValue} ${currentMetric.unit}`}`,
                            position: "right",
                            style: {
                                color: currentMetric.color,
                                background: "#1e293b",
                                padding: {
                                    left: 5,
                                    right: 5,
                                    top: 2,
                                    bottom: 2,
                                },
                            },
                        },
                    },
                ],
            },
        },
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 rounded-md p-2 text-white">
                        <FontAwesomeIcon icon={faChartLine} className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">
                            Evolution over {weeklyDistance.length} weeks • {' '}
                            <span className={isImproving ? "text-success font-medium" : "text-error font-medium"}>
                                {isImproving ? "Improving" : "Declining"}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveMetric("distance")}
                        className={`btn btn-xs ${activeMetric === "distance" ? "btn-primary" : "btn-ghost"}`}
                    >
                        Distance
                    </button>
                    <button
                        onClick={() => setActiveMetric("elevation")}
                        className={`btn btn-xs ${activeMetric === "elevation" ? "btn-primary" : "btn-ghost"}`}
                    >
                        Elevation
                    </button>
                    <button
                        onClick={() => setActiveMetric("time")}
                        className={`btn btn-xs ${activeMetric === "time" ? "btn-primary" : "btn-ghost"}`}
                    >
                        Time
                    </button>
                </div>
            </div>
            <div className="px-2 pb-0">
                <Chart {...chartConfig} />
            </div>
        </>
    );
}
