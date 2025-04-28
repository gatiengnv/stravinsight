import React from "react";

export default function FitnessTrendItem({heights}) {
    const isImproving = heights[heights.length - 1] > heights[0];

    return (
        <>
            <div className="flex items-end justify-center gap-1 sm:gap-1.5 h-48 mb-4 px-2 sm:px-4">
                {heights.map((height, index) => (
                    <div
                        key={index}
                        className="bg-orange-500 w-full rounded-t-sm"
                        style={{height: height / 10}}
                    ></div>
                ))}
            </div>
            <div className="text-center text-sm flex items-center justify-center gap-2">
                <span className="opacity-80">Last {heights.length} weeks</span>
                <span
                    className={`flex items-center gap-1 font-semibold ${
                        isImproving ? "text-success" : "text-error"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={
                                isImproving
                                    ? "M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                                    : "M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                            }
                        />
                    </svg>
                    {isImproving ? "Improving" : "Depreciating"}
                </span>
            </div>
        </>
    );
}
