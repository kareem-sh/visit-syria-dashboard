// src/components/common/Map.jsx
import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon paths (only once)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultPosition = [33.5138, 36.2765];

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

/**
 * Props:
 *  - position: [lat, lng] (defaults to Damascus)
 *  - width: number (px) or CSS string (e.g. "100%", "min(100%,420px)") - default 400
 *  - height: number (px) or CSS string - default 200
 *  - borderColor: CSS color
 *  - borderWidth: number (px)
 *  - zoom: number
 *  - parentRef: ref to the card (optional) to listen for transitions
 */
const Map = ({
                 position = defaultPosition,
                 width = 400,
                 height = 200,
                 borderColor = "green",
                 borderWidth = 4,
                 zoom = 15,
                 parentRef = null,
             }) => {
    const wrapperRef = useRef(null);
    const mapKey = position ? position.join(",") : "default";

    const widthStyle = typeof width === "number" ? `${width}px` : width;
    const heightStyle = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            ref={wrapperRef}
            style={{
                width: widthStyle,
                height: heightStyle,
                border: `${borderWidth}px solid ${borderColor}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <MapContainer
                key={mapKey}
                center={position}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                zoomControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={position} />
                <ResizeMap parentRef={parentRef || wrapperRef} />
            </MapContainer>
        </div>
    );
};

export default Map;
