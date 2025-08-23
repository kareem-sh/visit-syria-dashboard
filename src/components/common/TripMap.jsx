// src/components/trip/TripMap.jsx
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon for trip markers - emerald-450 color and smaller size
const createCustomIcon = (color = "#10b981") => { // emerald-500 color
    return new L.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `)}`,
        iconSize: [24, 24], // Smaller size: 24x24 instead of 32x32
        iconAnchor: [12, 12], // Adjusted anchor for smaller icon
        popupAnchor: [0, -12], // Adjusted popup anchor
    });
};

function ResizeMap({ parentRef }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const tryInvalidate = (delay = 50) => {
            setTimeout(() => map.invalidateSize(true), delay);
            setTimeout(() => map.invalidateSize(true), delay + 200);
        };

        tryInvalidate(0);

        const onResize = () => map.invalidateSize(true);
        window.addEventListener("resize", onResize);

        const parent = parentRef?.current || map.getContainer().parentElement;
        const onParentChange = () => tryInvalidate(100);

        if (parent) {
            parent.addEventListener("transitionend", onParentChange);
            parent.addEventListener("animationend", onParentChange);
        }

        return () => {
            window.removeEventListener("resize", onResize);
            if (parent) {
                parent.removeEventListener("transitionend", onParentChange);
                parent.removeEventListener("animationend", onParentChange);
            }
        };
    }, [map, parentRef]);

    return null;
}

const TripMap = ({
                     tripPath,
                     width = "100%",
                     height = "400px",
                     borderColor = "#10b981",
                     borderWidth = 2,
                     zoom = 10
                 }) => {
    const wrapperRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        // Simulate loading for better UX
        const timer = setTimeout(() => {
            setIsLoading(false);
            setMapReady(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (!tripPath || !tripPath.markers || tripPath.markers.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-gray-100 rounded-xl"
                style={{
                    width: typeof width === "number" ? `${width}px` : width,
                    height: typeof height === "number" ? `${height}px` : height,
                    border: `${borderWidth}px solid ${borderColor}`,
                }}
            >
                <p className="text-gray-500">No map data available</p>
            </div>
        );
    }

    // Convert markers to [lat, lng] format for Leaflet
    const markers = tripPath.markers.map(marker => [marker.lat, marker.lng]);

    // Convert route points to [lat, lng] format if they're objects
    const routePath = Array.isArray(tripPath.route) && tripPath.route.length > 0
        ? tripPath.route[0].lat !== undefined
            ? tripPath.route.map(point => [point.lat, point.lng])
            : tripPath.route
        : markers;

    // Calculate bounds to fit all markers
    const bounds = L.latLngBounds(markers);

    const widthStyle = typeof width === "number" ? `${width}px` : width;
    const heightStyle = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            ref={wrapperRef}
            className="relative rounded-xl overflow-hidden"
            style={{
                width: widthStyle,
                height: heightStyle,
                border: `${borderWidth}px solid ${borderColor}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-2"></div>
                        <p className="text-gray-600">Loading map...</p>
                    </div>
                </div>
            )}

            {mapReady && (
                <MapContainer
                    bounds={bounds}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom={true}
                    doubleClickZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Draw route path */}
                    <Polyline
                        positions={routePath}
                        color="#10b981"
                        weight={4}
                        opacity={0.7}
                        dashArray="5, 10"
                    />

                    {/* Add markers - all with emerald color */}
                    {markers.map((position, index) => (
                        <Marker
                            key={index}
                            position={position}
                            icon={createCustomIcon("#10b981")} // emerald color
                        >
                        </Marker>
                    ))}

                    <ResizeMap parentRef={wrapperRef} />
                </MapContainer>
            )}
        </div>
    );
};

export default TripMap;