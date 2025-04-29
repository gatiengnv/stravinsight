import React from "react";
import Chart from "react-apexcharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBolt} from "@fortawesome/free-solid-svg-icons";

export default function FitnessTrend({heights}) {
    const isImproving = heights[heights.length - 1] > heights[0];

    const weekLabels = heights.map((_, index) => `S${index + 1}`);

    const chartConfig = {
        type: "bar",
        height: 240,
        series: [
            {
                name: "Fitness",
                data: heights,
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
            colors: ["#f97316"],
            plotOptions: {
                bar: {
                    columnWidth: "40%",
                    borderRadius: 2,
                },
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
                categories: weekLabels,
            },
            yaxis: {
                labels: {
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
                opacity: 0.9,
                type: "solid",
                colors: ["#f97316"],
            },
            tooltip: {
                theme: "dark",
                y: {
                    formatter: (value) => `${value}`,
                },
            },
        },
    };

    return (
        <>
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 rounded-md p-2 text-white">
                    <FontAwesomeIcon icon={faBolt} className="h-5 w-5"/>
                </div>
                <div>
                    <p className="text-sm opacity-80">
                        Last {heights.length} weeks • {' '}
                        <span className={isImproving ? "text-success font-medium" : "text-error font-medium"}>
                            {isImproving ? "Improving" : "Depreciating"}
                        </span>
                    </p>
                </div>
            </div>
            <div className="px-2 pb-0">
                <Chart {...chartConfig} />
            </div>
        </>
    );
}
