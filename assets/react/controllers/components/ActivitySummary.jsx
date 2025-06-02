import React, {useCallback, useEffect, useRef, useState} from "react";
import Map from "./Map";
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faDownload,
    faFire,
    faHeart,
    faLocationDot,
    faPersonRunning,
    faShare,
    faStopwatch,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import SportIcon from "./SportIcon";

const IMAGE_COLOR_PALETTE = {
    BG_MAIN: "#0f0f0f", TEXT_MAIN: "#F0F0F0", TEXT_MUTED: "#A0A0A0",
    CARD_BG: "#1C1C1E", PRIMARY_ACCENT: "#FF9500", BORDER_COLOR: "#2D2D2F",
    MAP_PLACEHOLDER_BG: "#282A2D",
};

const SUMMARY_IMAGE_WIDTH = 1000;
const SUMMARY_IMAGE_BG_COLOR = IMAGE_COLOR_PALETTE.BG_MAIN;
const CANVAS_SCALE_FACTOR = 2;
const CAPTURE_DELAY_MS = 2500;

const waitForImages = (containerElement) => {
    if (!containerElement) return Promise.resolve();
    const images = Array.from(containerElement.querySelectorAll('img'));
    const promises = images.map(img => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
        return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });
    return Promise.all(promises);
};

function StatCard({label, value, unit, icon, cardBgColor, textColor, mutedTextColor, iconColor}) {
    if (value === null || value === undefined || String(value).trim() === "") return null;
    return (
        <div
            className="rounded-lg p-3 text-center flex flex-col justify-between items-center min-h-[100px] sm:min-h-[110px]"
            style={{backgroundColor: cardBgColor, color: textColor}}
        >
            <div className="text-xs" style={{color: mutedTextColor, opacity: 0.85}}>{label}</div>
            <div className="font-bold text-xl sm:text-2xl"
                 style={{color: textColor, marginTop: '4px', marginBottom: '4px'}}>
                {value}
                {unit && <span className="text-sm font-normal" style={{color: textColor, opacity: 0.8}}> {unit}</span>}
            </div>
            {icon && <FontAwesomeIcon icon={icon} style={{color: iconColor}} className="h-5 w-5"/>}
        </div>
    );
}

function ShareModal({isOpen, onClose, onDownload, imageUrl, generatingImage, error}) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral text-neutral-content rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Activity Summary</h3>
                    <button onClick={onClose} className="btn btn-sm btn-ghost" aria-label="Close modal"><FontAwesomeIcon
                        icon={faXmark}/></button>
                </div>
                {generatingImage ? (<div className="text-center p-4"><span
                        className="loading loading-spinner loading-lg text-primary"></span><p className="mt-3">Preparing
                        image...</p></div>
                ) : imageUrl ? (
                    <div className="flex flex-col items-center gap-4"><img src={imageUrl} alt="Activity summary preview"
                                                                           className="max-w-full rounded border border-base-300"/>
                        <button onClick={onDownload} className="btn btn-primary w-full mt-2"><FontAwesomeIcon
                            icon={faDownload} className="mr-2"/> Download Image
                        </button>
                    </div>
                ) : (
                    <p className="text-center p-4 text-error">{error || "Failed to generate image. Please try again."}</p>)}
            </div>
        </div>
    );
}

export default function ActivitySummary({activity, activityDetail}) {
    const summaryToCaptureRef = useRef(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generationError, setGenerationError] = useState(null);

    const {formattedDate, formattedTime} = React.useMemo(() => {
        if (!activity?.startDateLocal) return {formattedDate: '', formattedTime: ''};
        const activityDate = new Date(activity.startDateLocal);
        return {
            formattedDate: activityDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
            }),
            formattedTime: activityDate.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
                hour12: false
            })
        };
    }, [activity?.startDateLocal]);

    useEffect(() => {
        if (!isGeneratingImage) {
            return;
        }

        if (!summaryToCaptureRef.current) {
            const retryTimeout = setTimeout(() => {
                if (isGeneratingImage && !summaryToCaptureRef.current) {
                    console.error("Summary content ref not available after initial render. Aborting image generation.");
                    setGenerationError("Image content area could not be prepared.");
                    setIsGeneratingImage(false);
                }
            }, 100);
            return () => clearTimeout(retryTimeout);
        }

        const captureTimerId = setTimeout(async () => {
            if (!summaryToCaptureRef.current) {
                setIsGeneratingImage(false);
                setGenerationError("Component for image generation disappeared before capture.");
                return;
            }
            try {
                await waitForImages(summaryToCaptureRef.current);
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                const canvas = await html2canvas(summaryToCaptureRef.current, {
                    scale: CANVAS_SCALE_FACTOR,
                    logging: true,
                    backgroundColor: SUMMARY_IMAGE_BG_COLOR,
                    useCORS: true,
                    width: SUMMARY_IMAGE_WIDTH,
                    windowWidth: SUMMARY_IMAGE_WIDTH,
                    scrollX: 0, scrollY: 0,
                });
                const url = canvas.toDataURL("image/png");
                setGeneratedImageUrl(url);
                setGenerationError(null);
            } catch (err) {
                console.error("html2canvas error during capture:", err);
                setGenerationError("Could not generate summary image. " + (err.message || "Details in console."));
                setGeneratedImageUrl(null);
            } finally {
                setIsGeneratingImage(false);
            }
        }, CAPTURE_DELAY_MS);

        return () => clearTimeout(captureTimerId);

    }, [isGeneratingImage]);

    const handlePrepareImage = useCallback(() => {
        setShowShareModal(true);
        setGeneratedImageUrl(null);
        setGenerationError(null);
        setIsGeneratingImage(true);
    }, []);

    const handleDownloadImage = useCallback(() => {
        if (!generatedImageUrl || !activity) return;
        const safeActivityName = (activity.name || 'activity').replace(/[^\w\s-]/gi, '').replace(/\s+/g, '_');
        const safeDate = (formattedDate || 'summary').replace(/\s+/g, '_');
        const fileName = `${safeActivityName}-${safeDate}.png`.toLowerCase();
        fetch(generatedImageUrl)
            .then(res => res.blob())
            .then(blob => {
                saveAs(blob, fileName);
            })
            .catch(err => {
                console.error("Download error:", err);
                setGenerationError("Could not download image.");
            });
    }, [generatedImageUrl, activity, formattedDate]);

    const handleCloseShareModal = useCallback(() => {
        setShowShareModal(false);
    }, []);

    if (!activity) return null;

    const statsData = [
        {label: "Distance", value: activity.distance, unit: "km", icon: faLocationDot},
        {label: "Pace", value: activity.averagePace, unit: "/km", icon: faPersonRunning},
        {label: "Duration", value: activity.movingTime, unit: "", icon: faStopwatch},
        {
            label: "Elevation",
            value: activity.totalElevationGain > 0 ? activity.totalElevationGain : null,
            unit: "m",
            icon: faChartLine
        },
        {
            label: "Calories",
            value: activityDetail?.calories > 0 ? activityDetail.calories : null,
            unit: "",
            icon: faFire
        },
        {label: "Heart Rate", value: activity.averageHeartrate, unit: "bpm", icon: faHeart},
    ].filter(stat => stat.value !== null && stat.value !== undefined && String(stat.value).trim() !== "");

    return (
        <div className="mb-4">
            <button onClick={handlePrepareImage} className="btn btn-primary"
                    title="Generate and Download Summary Image">
                <FontAwesomeIcon icon={faShare}/>
            </button>

            <ShareModal
                isOpen={showShareModal}
                onClose={handleCloseShareModal}
                onDownload={handleDownloadImage}
                imageUrl={generatedImageUrl}
                generatingImage={isGeneratingImage && !generatedImageUrl && !generationError}
                error={generationError}
            />
            {isGeneratingImage && (
                <div>
                    <div ref={summaryToCaptureRef}
                         className="flex flex-col gap-4 p-5"
                         style={{
                             width: `${SUMMARY_IMAGE_WIDTH}px`, backgroundColor: IMAGE_COLOR_PALETTE.BG_MAIN,
                             color: IMAGE_COLOR_PALETTE.TEXT_MAIN,
                             fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
                         }}>
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3" style={{alignItems: 'center'}}>
                                {activity.type && (
                                    <div className="flex items-center justify-center"
                                         style={{height: '32px', width: '32px'}}>
                                        <SportIcon type={activity.type}/>
                                    </div>
                                )}
                                <h1 className="text-2xl font-bold m-0 mb-4">
                                    {activity.name || 'My activity'}
                                </h1>
                            </div>

                            <div className="text-right text-xs whitespace-nowrap flex-shrink-0"
                                 style={{color: IMAGE_COLOR_PALETTE.TEXT_MUTED, opacity: 0.9}}>
                                <div>{formattedDate}</div>
                                {formattedTime && <div>at {formattedTime}</div>}
                            </div>
                        </div>

                        {activityDetail?.mapPolyline && (
                            <div className="rounded-lg overflow-hidden" style={{
                                backgroundColor: IMAGE_COLOR_PALETTE.MAP_PLACEHOLDER_BG,
                                width: '100%',
                                height: '350px'
                            }}>
                                <Map
                                    encodedPolyline={activityDetail.mapPolyline}
                                    averagePace={0}
                                    showMapControls={false}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-3 pt-1">
                            {statsData.map(stat => (
                                <StatCard key={stat.label} {...stat}
                                          cardBgColor={IMAGE_COLOR_PALETTE.CARD_BG}
                                          textColor={IMAGE_COLOR_PALETTE.TEXT_MAIN}
                                          mutedTextColor={IMAGE_COLOR_PALETTE.TEXT_MUTED}
                                          iconColor={IMAGE_COLOR_PALETTE.PRIMARY_ACCENT}/>
                            ))}
                        </div>

                        <div className="flex w-full justify-between items-center pt-3 mt-2"
                             style={{borderTop: `1px solid ${IMAGE_COLOR_PALETTE.BORDER_COLOR}`}}>
                            <div className="text-xs" style={{color: IMAGE_COLOR_PALETTE.TEXT_MUTED, opacity: 0.9}}>
                                {activity.type || 'Activity'}
                                {activity.totalElevationGain > 0 ? ` · ${activity.totalElevationGain.toLocaleString()}m gain` : ''}
                            </div>
                            <div className="flex">
                                <span className="text-sm font-semibold flex items-center leading-none"
                                      style={{color: IMAGE_COLOR_PALETTE.PRIMARY_ACCENT}}>
                                                <img src="/img/icon.png" alt="StravInsight Logo"
                                                     className="w-5 mt-3 ml-1 mr-2"/>
                                StravInsight
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
