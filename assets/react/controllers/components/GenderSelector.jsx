import React from 'react';

export default function GenderSelector({gender, setGender}) {
    return (
        <div className="flex gap-4 justify-center">
            <button
                className={`btn btn-lg ${gender === "M" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setGender("M")}
            >
                Male
            </button>

            <button
                className={`btn btn-lg ${gender === "F" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setGender("F")}
            >
                Female
            </button>
        </div>
    );
}
