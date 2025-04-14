import React from "react";

export default function activities() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">Morning Run</div>
                    <div className="text-xs opacity-70">Today</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">5.2 km</div>
                    <div className="text-xs opacity-70">28:45</div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">Evening Ride</div>
                    <div className="text-xs opacity-70">Yesterday</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">12.7 km</div>
                    <div className="text-xs opacity-70">42:18</div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">Trail Run</div>
                    <div className="text-xs opacity-70">2 days ago</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">8.4 km</div>
                    <div className="text-xs opacity-70">52:30</div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">Recovery Ride</div>
                    <div className="text-xs opacity-70">3 days ago</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">15.3 km</div>
                    <div className="text-xs opacity-70">55:12</div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <div>
                    <div className="font-semibold">Long Run</div>
                    <div className="text-xs opacity-70">5 days ago</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">18.6 km</div>
                    <div className="text-xs opacity-70">1:45:22</div>
                </div>
            </div>
        </div>
    );
}
