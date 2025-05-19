import {useEffect} from "react";

export default function Initialize() {
    const fetchActivities = async () => {
        const response = await fetch(
            `/api/activities/sync`,
        );

        if (!response.ok) {
            throw new Error('Prediction error');
        }

        return await response.json();
    }

    useEffect(() => {
        fetchActivities()
            .then((data) => {
                if (data.status === "success") {
                    window.location.href = "/dashboard";
                }
            })
            .catch((error) => {
                console.error('Error fetching activities:', error);
            });
    })

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-lg font-medium animate-pulse">Loading your activities</p>
            <progress className="progress progress-primary w-56"></progress>
        </div>
    )
}
