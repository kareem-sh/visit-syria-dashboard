// components/MapSearchPicker.jsx
import React, { useEffect, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// leaflet icon fix (same as your other file)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Internal small helpers used by the component
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) map.setView(position, 15, { animate: true });
    }, [position, map]);
    return null;
}

function MapClickHandler({ onClick }) {
    useMapEvent("click", (e) => {
        onClick([e.latlng.lat, e.latlng.lng]);
    });
    return null;
}

/**
 * MapSearchPicker
 *
 * Props:
 *  - initialPosition: [lat, lon] (optional)
 *  - initialPlace: string (optional)
 *  - onSelect: function({ display_name, lat, lon }) called when user picks a suggestion or clicks map
 *
 * Renders:
 *  - search input above map (suggestions dropdown)
 *  - map with clickable placement
 */
export default function MapSearchPicker({ initialPosition = [33.5138, 36.2765], initialPlace = "", onSelect }) {
    const [markerPosition, setMarkerPosition] = useState(initialPosition);
    const [query, setQuery] = useState(initialPlace);
    const [suggestions, setSuggestions] = useState([]);

    // reverse geocode to get display_name after map click
    const reverseGeocode = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
                { headers: { "Accept-Language": "ar,en" } }
            );
            const data = await res.json();
            return data.display_name || `${lat}, ${lon}`;
        } catch {
            return `${lat}, ${lon}`;
        }
    };

    const handleMapClick = async (coords) => {
        setMarkerPosition(coords);
        const display_name = await reverseGeocode(coords[0], coords[1]);
        setQuery(display_name);
        setSuggestions([]);
        if (onSelect) onSelect({ display_name, lat: coords[0], lon: coords[1] });
    };

    const searchLocation = async (q) => {
        setQuery(q);
        if (!q || !q.trim()) return setSuggestions([]);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    q
                )}&addressdetails=1&limit=7`,
                { headers: { "Accept-Language": "ar,en" } }
            );
            const data = await res.json();
            setSuggestions(data);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleSuggestionClick = (place) => {
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        setMarkerPosition([lat, lon]);
        setQuery(place.display_name);
        setSuggestions([]);
        if (onSelect) onSelect({ display_name: place.display_name, lat, lon });
    };

    return (
        <div className="relative">
            <div className="relative z-50">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => searchLocation(e.target.value)}
                    placeholder="ابحث عن مكان..."
                    className="p-3 border rounded-xl w-full bg-white focus:outline-none border-gray-300 focus:ring-2 focus:ring-green focus:border-green transition"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto z-50">
                        {suggestions.map((place, idx) => (
                            <li
                                key={idx}
                                onClick={() => handleSuggestionClick(place)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-right"
                            >
                                {place.display_name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden z-[1] mt-3">
                <MapContainer center={markerPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    <Marker position={markerPosition} />
                    <MapUpdater position={markerPosition} />
                    <MapClickHandler onClick={handleMapClick} />
                </MapContainer>
            </div>
        </div>
    );
}
