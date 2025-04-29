import React, {useMemo} from "react";
import Chart from "react-apexcharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartPie} from "@fortawesome/free-solid-svg-icons";

export default function ActivityPieChart({activityCountBySport}) {
    const chartData = useMemo(() => {
        return {
            series: activityCountBySport.map(item => item.count),
            labels: activityCountBySport.map(item => item.type)
        };
    }, [activityCountBySport]);

    const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"];

    const chartConfig = {
        type: "pie",
        height: 280,
        series: chartData.series,
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
            labels: chartData.labels,
            colors: colors,
            legend: {
                position: "bottom",
                fontFamily: "inherit",
                labels: {
                    colors: "#ffffff"
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return `${Math.round(val)}%`;
                },
                style: {
                    fontFamily: "inherit",
                },
            },
            tooltip: {
                theme: "dark",
                y: {
                    formatter: function (val) {
                        return val + " activities";
                    },
                },
            },
        },
    };

    const totalActivities = chartData.series.reduce((a, b) => a + b, 0);

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 rounded-md p-2 text-white">
                        <FontAwesomeIcon icon={faChartPie} className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm opacity-80">
                            Activities by sport type • {totalActivities} total
                        </p>
                    </div>
                </div>
            </div>
            <div className="px-2 pb-0">
                <Chart {...chartConfig} />
            </div>
        </>
    );
}
