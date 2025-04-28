import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Graphics = ({activityStream}) => {
    const [selectedMetrics, setSelectedMetrics] = useState(['altitudeData']);
    const [chartData, setChartData] = useState(null);

    const metricLabels = {
        altitudeData: 'Altitude (m)',
        velocityData: 'Speed (km/h)',
        gradeData: 'Grade (%)',
        cadenceData: 'Cadence (rpm)',
        heartrateData: 'Heart rate (bpm)',
        distanceData: 'Distance (m)'
    };

    const metricColors = {
        altitudeData: 'rgb(75, 192, 192)',
        velocityData: 'rgb(54, 162, 235)',
        gradeData: 'rgb(255, 159, 64)',
        cadenceData: 'rgb(153, 102, 255)',
        heartrateData: 'rgb(255, 99, 132)',
        distanceData: 'rgb(201, 203, 207)',
    };

    const toggleMetric = (metric) => {
        if (selectedMetrics.includes(metric)) {
            if (selectedMetrics.length > 1) {
                setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
            }
        } else {
            setSelectedMetrics([...selectedMetrics, metric]);
        }
    };

    useEffect(() => {
        if (!activityStream) return;

        const hasSelectedData = selectedMetrics.some(metric => activityStream[metric]);
        if (!hasSelectedData) return;

        const datasets = selectedMetrics
            .filter(metric => activityStream[metric])
            .map(metric => {
                let dataToDisplay = [...activityStream[metric]];
                if (metric === 'velocityData') {
                    dataToDisplay = dataToDisplay.map(value => value * 3.6);
                }

                return {
                    label: metricLabels[metric] || metric,
                    data: dataToDisplay,
                    borderColor: metricColors[metric] || 'rgb(75, 192, 192)',
                    backgroundColor: metricColors[metric] || 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1,
                    pointRadius: 0,
                };
            });

        const data = {
            labels: activityStream.timeData
                ? activityStream.timeData.map((_, index) => index)
                : Array.from({length: activityStream[selectedMetrics[0]].length}, (_, i) => i),
            datasets: datasets,
        };

        setChartData(data);
    }, [selectedMetrics, activityStream]);

    if (!activityStream || !chartData) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Activity data</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                    {Object.keys(metricLabels).map((metric) => (
                        <div key={metric} className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">{metricLabels[metric]}</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={selectedMetrics.includes(metric)}
                                    onChange={() => toggleMetric(metric)}
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div className="h-80">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                    callbacks: {
                                        title: function () {
                                            return '';
                                        },
                                        label: function (context) {
                                            const label = context.dataset.label || '';
                                            const value = context.parsed.y;
                                            return `${label}: ${value.toFixed(1)}`;
                                        }
                                    }
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time',
                                    },
                                    ticks: {
                                        maxTicksLimit: 10,
                                        callback: function (value) {
                                            if (!activityStream.timeData) return value;
                                            const seconds = activityStream.timeData[value];
                                            if (seconds) {
                                                const mins = Math.floor(seconds / 60);
                                                const secs = Math.floor(seconds % 60);
                                                return `${mins}:${secs.toString().padStart(2, '0')}`;
                                            }
                                            return value;
                                        }
                                    }
                                },
                                y: {
                                    title: {
                                        display: selectedMetrics.length === 1,
                                        text: selectedMetrics.length === 1 ? metricLabels[selectedMetrics[0]] : '',
                                    },
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Graphics;
