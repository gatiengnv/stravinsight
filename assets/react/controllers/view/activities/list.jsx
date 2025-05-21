import React, {useEffect, useState} from "react";
import ActivityItem from "../../components/ActivityItem";
import Card from "../../components/Card";
import Drawer from "../../components/Drawer";

export default function List({activities: initialActivities, userSports}) {
    const [activities, setActivities] = useState(initialActivities);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [dateFilters, setDateFilters] = useState({
        startDate: null,
        endDate: null
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const startDate = urlParams.get('startDate');
        const endDate = urlParams.get('endDate');
        const sport = urlParams.get('sport');

        if (startDate || endDate || sport) {
            setDateFilters({
                startDate: startDate,
                endDate: endDate,
                sport: sport
            });
        }
    }, []);

    const loadMoreActivities = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        let url = `/activities?page=${currentPage + 1}`;
        if (dateFilters.startDate) {
            url += `&startDate=${dateFilters.startDate}`;
        }
        if (dateFilters.endDate) {
            url += `&endDate=${dateFilters.endDate}`;
        }
        if (dateFilters.sport) {
            url += `&sport=${dateFilters.sport}`;
        }

        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.activities.length > 0) {
                    setActivities(prev => [...prev, ...data.activities]);
                    setCurrentPage(data.nextPage);
                    setHasMore(data.hasMore);
                } else {
                    setHasMore(false);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error while loading data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                loadMoreActivities();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore, currentPage, dateFilters]);

    return (
        <Drawer title={"Activities"} showDateRangePicker={true} showSportPicker={true} userSports={userSports}>
            <Card>
                <div
                    className="hidden md:grid md:grid-cols-6 md:items-center text-sm font-bold p-3 border-b bg-base-200">
                    <div className="text-left">Type</div>
                    <div className="text-left">Date</div>
                    <div className="text-left col-span-2">Name</div>
                    <div className="text-right">Duration</div>
                    <div className="text-right">Distance / Elevation</div>
                </div>
                {activities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity}/>
                ))}
                {loading && (
                    <div className="flex justify-center items-center py-4">
                        <span className="loading loading-spinner loading-xl text-primary"></span>
                    </div>
                )}
            </Card>
        </Drawer>
    );
}
