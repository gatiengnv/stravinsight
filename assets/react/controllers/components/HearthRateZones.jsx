import React from "react";

export default function HearthRateZones({
                                            zones1percentage,
                                            zones2percentage,
                                            zones3percentage,
                                            zones4percentage,
                                            zones5percentage,
                                        }) {
    return (
        <>
            <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
                <div className="flex-grow">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Zone 1 (Recovery)</span>
                        <span className="font-semibold">{zones1percentage}%</span>
                    </div>
                    <progress
                        className="progress progress-success w-full h-2"
                        value={zones1percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
            <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
                <div className="flex-grow">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Zone 2 (Endurance)</span>
                        <span className="font-semibold">{zones2percentage}%</span>
                    </div>
                    <progress
                        className="progress progress-info w-full h-2"
                        value={zones2percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
            <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
                <div className="flex-grow">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Zone 3 (Tempo)</span>
                        <span className="font-semibold">{zones3percentage}%</span>
                    </div>
                    <progress
                        className="progress progress-warning w-full h-2"
                        value={zones3percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
            <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
                <div className="flex-grow">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Zone 4 (Threshold)</span>
                        <span className="font-semibold">{zones4percentage}%</span>
                    </div>
                    <progress
                        className="progress progress-error w-full h-2"
                        value={zones4percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
            <div className="flex items-center gap-3">
        <span className="flex-shrink-0">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
          >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </span>
                <div className="flex-grow">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Zone 5 (VO2 Max)</span>
                        <span className="font-semibold">{zones5percentage}%</span>
                    </div>
                    <progress
                        className="progress progress-error w-full h-2"
                        value={zones5percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
        </>
    );
}
