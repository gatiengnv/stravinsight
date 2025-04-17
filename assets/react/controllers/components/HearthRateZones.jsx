import React from "react";

export default function HearthRateZones({hearthRatePercentage}) {
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
                        <span>Zone 1 (Recovery) {hearthRatePercentage.zone1.minmax}</span>
                        <span className="font-semibold">
              {hearthRatePercentage.zone1.percentage}%
            </span>
                    </div>
                    <progress
                        className="progress progress-success w-full h-2"
                        value={hearthRatePercentage.zone1.percentage}
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
                        <span>Zone 2 (Endurance) {hearthRatePercentage.zone2.minmax}</span>
                        <span className="font-semibold">
              {hearthRatePercentage.zone2.percentage}%
            </span>
                    </div>
                    <progress
                        className="progress progress-info w-full h-2"
                        value={hearthRatePercentage.zone2.percentage}
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
                        <span>Zone 3 (Tempo) {hearthRatePercentage.zone3.minmax}</span>
                        <span className="font-semibold">
              {hearthRatePercentage.zone3.percentage}%
            </span>
                    </div>
                    <progress
                        className="progress progress-warning w-full h-2"
                        value={hearthRatePercentage.zone3.percentage}
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
                        <span>Zone 4 (Threshold) {hearthRatePercentage.zone4.minmax}</span>
                        <span className="font-semibold">
              {hearthRatePercentage.zone4.percentage}%
            </span>
                    </div>
                    <progress
                        className="progress progress-error w-full h-2"
                        value={hearthRatePercentage.zone4.percentage}
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
                        <span>Zone 5 (VO2 Max) {hearthRatePercentage.zone5.minmax}</span>
                        <span className="font-semibold">
              {hearthRatePercentage.zone5.percentage}%
            </span>
                    </div>
                    <progress
                        className="progress progress-error w-full h-2"
                        value={hearthRatePercentage.zone5.percentage}
                        max="100"
                    ></progress>
                </div>
            </div>
        </>
    );
}
