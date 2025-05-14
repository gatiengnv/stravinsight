import React from "react";

export default function StepPagination({
                                           handlePrevious,
                                           handleNext,
                                           currentStep,
                                           points,
                                           selectedMarathon,
                                           loading,
                                           heartRateZone,
                                           gender
                                       }) {
    return (
        <div className="flex justify-between mt-8">
            <button
                className="btn"
                onClick={handlePrevious}
                disabled={currentStep === 0}
            >
                Previous
            </button>

            <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={(currentStep === 0 && points.length < 2 && !selectedMarathon) ||
                    (currentStep === 1 && !heartRateZone) ||
                    (currentStep === 2 && !gender) ||
                    currentStep === 3 ||
                    loading}
            >
                {loading ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    currentStep < 2 ? "Next" : "Predict"
                )}
            </button>
        </div>
    )
}
