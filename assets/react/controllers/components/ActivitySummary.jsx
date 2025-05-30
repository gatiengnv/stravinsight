import React, {useRef, useState} from "react";
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";
import SportIcon from "./SportIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Card from "./Card";
import {
    faChartLine,
    faDownload,
    faFire,
    faHeart,
    faLocationDot,
    faPersonRunning,
    faShare,
    faStopwatch,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import Map from "./Map";

export default function ActivitySummary({activity, activityDetail, activityStream}) {
    const summaryRef = useRef(null);
    const [sharing, setSharing] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    if (!activity) {
        return null;
    }

    const activityDate = activity.startDateLocal && new Date(activity.startDateLocal);
    const formattedDate = activityDate?.toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric"
    }) || '';
    const formattedTime = activityDate?.toLocaleTimeString(undefined, {
        hour: "numeric", minute: "2-digit"
    }) || '';

    const waitForImages = (container) => {
        const images = container.querySelectorAll('img');
        return Promise.all(Array.from(images).map(img => {
            if (img.complete) {
                return Promise.resolve();
            } else {
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }
        }));
    };

    const prepareImage = () => {
        setSharing(true);
        setGenerating(true);
        setIsVisible(true);

        setTimeout(() => {
            if (!summaryRef.current) {
                setGenerating(false);
                return;
            }

            waitForImages(summaryRef.current).then(() => {
                html2canvas(summaryRef.current, {
                    scale: 2,
                    logging: true,
                    backgroundColor: "#0f0f0f",
                    useCORS: true,
                    allowTaint: true
                }).then(canvas => {
                    const url = canvas.toDataURL("image/png");
                    setImageUrl(url);
                    setGenerating(false);
                    setIsVisible(false);
                }).catch(err => {
                    console.error("Error generating image:", err);
                    setGenerating(false);
                    setIsVisible(false);
                });
            });
        }, 500);
    };

    const downloadImage = () => {
        if (!imageUrl) return;

        const fileName = `${activity.name || 'activity'}-${formattedDate}.png`;

        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                saveAs(blob, fileName);
            });
    };

    const closeShareModal = () => {
        setSharing(false);
        setImageUrl(null);
        setIsVisible(false);
    };

    return (
        <div className="mb-4">
            <button onClick={prepareImage} className="btn btn-primary" title="Share activity">
                <FontAwesomeIcon icon={faShare}/> Download Summary Image
            </button>

            {sharing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Share Activity</h3>
                            <button onClick={closeShareModal} className="btn btn-sm btn-ghost">
                                <FontAwesomeIcon icon={faXmark}/>
                            </button>
                        </div>

                        {generating ? (
                            <div className="text-center p-4">
                                <span className="loading loading-spinner"></span>
                                <p>Preparing image...</p>
                            </div>
                        ) : imageUrl ? (
                            <div className="flex flex-col items-center gap-4">
                                <img src={imageUrl} alt="Activity summary" className="max-w-full rounded border"/>

                                <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                                    <button onClick={downloadImage} className="btn btn-secondary flex-1">
                                        <FontAwesomeIcon icon={faDownload}/> Download Image
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center p-4">Failed to generate image</p>
                        )}
                    </div>
                </div>
            )}

            <div className={isVisible ? "absolute left-0 top-0 z-[-1] overflow-auto" : "hidden"}
                 style={{width: "1000px"}}>
                <div ref={summaryRef} className="flex flex-col gap-4 p-4 bg-white"
                     style={{width: "1000px", padding: "20px"}}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <Card>
                            <Map
                                encodedPolyline={activityDetail.mapPolyline}
                                averagePace={activity.averagePace || ""}
                            />
                        </Card>
                        <div className="flex items-center gap-2">
                            {activity.type && <SportIcon type={activity.type} className="text-2xl"/>}
                            <h2 className="font-bold text-xl">{activity.name || 'My Activity'}</h2>
                        </div>
                        <div className="text-sm opacity-75">
                            {formattedDate} {formattedTime && `at ${formattedTime}`}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {activity.distance && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Distance</div>
                                <div className="font-semibold text-lg">{activity.distance} km</div>
                                <FontAwesomeIcon icon={faLocationDot} className="text-primary mt-1"/>
                            </div>
                        )}
                        {activity.averagePace && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Pace</div>
                                <div className="font-semibold text-lg">{activity.averagePace} /km</div>
                                <FontAwesomeIcon icon={faPersonRunning} className="text-primary mt-1"/>
                            </div>
                        )}
                        {activity.movingTime && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Duration</div>
                                <div className="font-semibold text-lg">{activity.movingTime}</div>
                                <FontAwesomeIcon icon={faStopwatch} className="text-primary mt-1"/>
                            </div>
                        )}
                        {activity.totalElevationGain > 0 && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Elevation</div>
                                <div className="font-semibold text-lg">{activity.totalElevationGain} m</div>
                                <FontAwesomeIcon icon={faChartLine} className="text-primary mt-1"/>
                            </div>
                        )}
                        {activityDetail && activityDetail.calories > 0 && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Calories</div>
                                <div className="font-semibold text-lg">{activityDetail.calories}</div>
                                <FontAwesomeIcon icon={faFire} className="text-primary mt-1"/>
                            </div>
                        )}
                        {activity.averageHeartrate && (
                            <div className="stat-box bg-base-200 rounded p-3 text-center">
                                <div className="text-xs opacity-70">Heart Rate</div>
                                <div className="font-semibold text-lg">{activity.averageHeartrate} bpm</div>
                                <FontAwesomeIcon icon={faHeart} className="text-primary mt-1"/>
                            </div>
                        )}
                    </div>

                    <div className="mt-2 p-3 bg-base-100 rounded-lg">
                        <h3 className="text-sm font-semibold mb-2">Activity Summary</h3>
                        <div className="ai-summary">
                            <div className="p-2 rounded bg-base-100">
                                {activity.description || "Activity summary"}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 mt-3">
                        <div className="text-sm opacity-75">
                            {activity.type || 'Activity'}
                            {activity.totalElevationGain > 0 ? ` · ${activity.totalElevationGain}m gain` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
