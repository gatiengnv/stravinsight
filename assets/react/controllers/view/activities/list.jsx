import React from "react";
import ActivityItem from "../../components/ActivityItem";
import Card from "../../components/Card";
import Drawer from "../../components/Drawer";

export default function list({activities}) {
    return (
        <Drawer title={"Activities"}>
            <Card>
                {activities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity}/>
                ))}
            </Card>
        </Drawer>
    );
}
