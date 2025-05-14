import React, {useEffect, useRef} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function RouteMap({points, setPoints}) {
    const mapRef = useRef(null);
    const leafletMapRef = useRef(null);
    const polylineRef = useRef(null);
    const pointsRef = useRef([]);

    useEffect(() => {
        if (mapRef.current && !leafletMapRef.current) {
            const map = L.map(mapRef.current).setView([46.603354, 1.888334], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            leafletMapRef.current = map;

            polylineRef.current = L.polyline([], {
                color: '#4285F4',
                weight: 4
            }).addTo(map);

            map.on('click', (e) => {
                const newPoint = {lat: e.latlng.lat, lng: e.latlng.lng};
                pointsRef.current = [...pointsRef.current, newPoint];
                setPoints(pointsRef.current);

                polylineRef.current.addLatLng([newPoint.lat, newPoint.lng]);
            });
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.off('click');
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
            polylineRef.current = null;
        };
    }, [setPoints]);

    const clearRoute = () => {
        pointsRef.current = [];
        setPoints([]);
        if (polylineRef.current) {
            polylineRef.current.setLatLngs([]);
        }
    };

    return (
        <div>
            <div ref={mapRef} style={{height: '400px', width: '100%'}}></div>
            <button className="btn btn-sm btn-outline mt-2" onClick={clearRoute}>
                Clear Route
            </button>
        </div>
    );
}
