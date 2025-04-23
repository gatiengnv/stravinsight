import React, {useEffect, useRef} from "react";
import polyline from "@mapbox/polyline";

export default function Map({encodedPolyline}) {
    const mapRef = useRef(null);

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: {lat: 48.8566, lng: 2.3522},
            zoom: 13,
        });

        const decodedPath = polyline.decode(encodedPolyline);
        console.log(decodedPath);

        const googlePath = decodedPath.map(([lat, lng]) => ({lat, lng}));

        const path = new window.google.maps.Polyline({
            path: googlePath,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        path.setMap(map);

        const bounds = new window.google.maps.LatLngBounds();
        googlePath.forEach((point) => bounds.extend(point));
        map.fitBounds(bounds);
    }, [encodedPolyline]);

    return (
        <div
            ref={mapRef}
            className="aspect-video bg-base-300 rounded-box"
            style={{height: "400px"}}
        ></div>
    );
}
