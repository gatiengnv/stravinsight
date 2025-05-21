import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faDumbbell,
    faFutbol,
    faGolfBall,
    faHiking,
    faMountain,
    faPersonBiking,
    faPersonRunning,
    faPersonSkating,
    faPersonSkiing,
    faPersonSnowboarding,
    faPersonSwimming,
    faPersonWalking,
    faSailboat,
    faStairs,
    faWater,
    faWheelchair,
    faWind,
    faYinYang
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function SportIcon({type}) {
    console.log(type);
    const getIconForSport = () => {
        switch (type) {
            case "AlpineSki":
            case "BackcountrySki":
            case "NordicSki":
            case "RollerSki":
                return faPersonSkiing;
            case "Canoeing":
            case "Kayaking":
                return faWater;
            case "Crossfit":
            case "WeightTraining":
            case "Workout":
                return faDumbbell;
            case "EBikeRide":
            case "Ride":
            case "VirtualRide":
            case "Velomobile":
                return faPersonBiking;
            case "Elliptical":
                return faStairs;
            case "Golf":
                return faGolfBall;
            case "Handcycle":
            case "Wheelchair":
                return faWheelchair;
            case "Hike":
                return faHiking;
            case "IceSkate":
            case "InlineSkate":
            case "Skateboard":
                return faPersonSkating;
            case "Kitesurf":
            case "Windsurf":
                return faWind;
            case "RockClimbing":
                return faMountain;
            case "Rowing":
            case "StandUpPaddling":
                return faWater;
            case "Run":
            case "VirtualRun":
                return faPersonRunning;
            case "Sail":
                return faSailboat;
            case "Snowboard":
            case "Snowshoe":
                return faPersonSnowboarding;
            case "Soccer":
                return faFutbol;
            case "StairStepper":
                return faStairs;
            case "Surfing":
                return faWater;
            case "Swim":
                return faPersonSwimming;
            case "Walk":
                return faPersonWalking;
            case "Yoga":
                return faYinYang;
            default:
                return faPersonRunning;
        }
    };

    return <FontAwesomeIcon icon={getIconForSport()}/>;
}
