import React from "react";
import ActivityItem from "../../components/ActivityItem";
import Card from "../../components/Card";

export default function list({activities}) {
    return (
        <Card>
            {activities.map((activity, index) => (
                <ActivityItem key={index} activity={activity}/>
            ))}
        </Card>
    );
}
