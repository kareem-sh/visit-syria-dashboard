import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet's default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Component to handle clicking on map
function LocationMarker({ marker, setMarker, onChange }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setMarker([lat, lng]);
            onChange({ lat, lng });
        },
    });
    return marker ? <Marker position={marker} /> : null;
}

export default function ReusableFormDialog({
                                               title,
                                               fields,
                                               initialValues = {},
                                               onClose,
                                               onSubmit,
                                           }) {
    const [formData, setFormData] = useState(initialValues);
    const [marker, setMarker] = useState(
        initialValues.location
            ? [initialValues.location.lat, initialValues.location.lng]
            : null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const mapRef = useRef();

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery.trim()) return;

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        searchQuery
                    )}`
                );
                const data = await res.json();
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    const latLng = [parseFloat(lat), parseFloat(lon)];
                    if (mapRef.current) mapRef.current.setView(latLng, 15);
                    setMarker(latLng);
                    handleChange("location", { lat: parseFloat(lat), lng: parseFloat(lon) });
                }
            } catch (error) {
                console.error("Map search error:", error);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer); // Cleanup if typing continues
    }, [searchQuery]);

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative">
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <X />
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-green-600 mb-6">{title}</h2>

                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.key} className="flex flex-col col-span-2 sm:col-span-1">
                            <label className="text-sm text-gray-700 mb-1">{field.label}</label>

                            {field.type === "map" ? (
                                <div className="space-y-2">
                                    {/* Search bar */}
                                    <input
                                        type="text"
                                        placeholder="Search for a place..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 p-2 border rounded-md"
                                    />

                                    {/* Map */}
                                    <MapContainer
                                        center={marker || [35.6892, 139.6917]} // Default Tokyo
                                        zoom={marker ? 15 : 5}
                                        style={{ height: "300px", width: "100%" }}
                                        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution="&copy; OpenStreetMap contributors"
                                        />
                                        <LocationMarker
                                            marker={marker}
                                            setMarker={setMarker}
                                            onChange={(val) => handleChange(field.key, val)}
                                        />
                                    </MapContainer>
                                </div>
                            ) : field.type === "textarea" ? (
                                <textarea
                                    required={field.required}
                                    maxLength={field.maxLength}
                                    placeholder={field.placeholder}
                                    value={formData[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="p-2 border rounded-md resize-none h-24"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    value={formData[field.key] || ""}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    className="p-2 border rounded-md"
                                />
                            )}
                        </div>
                    ))}

                    {/* Full-width submit button */}
                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                        >
                            إضافة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
