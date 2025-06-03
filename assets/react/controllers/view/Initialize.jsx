import {useEffect} from "react";

export default function Initialize({
                                       endpoint = '/api/activities/sync',
                                       redirectUrl = '/dashboard',
                                       loadingText = 'Loading your activities'
                                   }) {
    const fetchActivities = async () => {
        const response = await fetch(
            `${endpoint}`,
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
                    window.location.replace(`${redirectUrl}`);
                }
            })
            .catch((error) => {
                console.error('Error fetching activities:', error);
            });
    }, [])

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-lg font-medium animate-pulse">{loadingText}</p>
            <progress className="progress progress-primary w-56"></progress>
        </div>
    )
}
