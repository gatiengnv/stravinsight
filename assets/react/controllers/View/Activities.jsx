import React from "react";
import ActivityItem from "../components/ActivityItem";
import Card from "../components/Card";

export default function activities() {
    return (
        <Card>
            <ActivityItem activity={{
                name: "Morning Run",
                startDateLocal: "2023-10-01 07:30",
                distance: "5.2 km",
                movingTime: "30:15",
            }}></ActivityItem>
            <ActivityItem activity={{
                name: "Evening Walk",
                startDateLocal: "2023-10-02 18:00",
                distance: "2.5 km",
                movingTime: "25:00",
            }}></ActivityItem>
            <ActivityItem activity={{
                name: "Cycling",
                startDateLocal: "2023-10-03 09:00",
                distance: "15.0 km",
                movingTime: "45:00",
            }}></ActivityItem>
            <ActivityItem activity={{
                name: "Swimming",
                startDateLocal: "2023-10-04 10:00",
                distance: "1.0 km",
                movingTime: "30:00",
            }}></ActivityItem>
        </Card>
    );
}
