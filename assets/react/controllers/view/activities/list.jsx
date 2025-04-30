import React, {useEffect, useState} from "react";
import ActivityItem from "../../components/ActivityItem";
import Card from "../../components/Card";
import Drawer from "../../components/Drawer";

export default function List({activities: initialActivities}) {
    const [activities, setActivities] = useState(initialActivities);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMoreActivities = () => {
        if (loading || !hasMore) return;

        setLoading(true);

        fetch(`/activities?page=${currentPage + 1}`, {
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
                console.error('Erreur lors du chargement des activités:', error);
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
    }, [loading, hasMore, currentPage]);

    return (
        <Drawer title={"Activities"}>
            <Card>
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
