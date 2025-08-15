import React, { useState, useRef, useEffect } from "react";
import { X as XIcon, Trash2 } from "lucide-react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import Switch from "@mui/material/Switch";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

export default function EventForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        durationDays: "",
        durationHours: "",
        price: "",
        ticketCount: "",
        prebooking: 0, // numeric 0/1
        freeEvent: false,
        unlimitedTickets: false,
        location: "",
        startDate: "",
        images: [],
    });

    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState([33.5138, 36.2765]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    // Reverse geocode helper
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

    // GENERAL INPUT CHANGE
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // special handling for prebooking radio -> store number
        if (name === "prebooking") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Switch handlers for MUI Switch
    const handleFreeToggle = (_, checked) => {
        setFormData((prev) => ({
            ...prev,
            freeEvent: checked,
            price: checked ? "" : prev.price, // clear input visually when free
        }));
    };

    const handleUnlimitedToggle = (_, checked) => {
        setFormData((prev) => ({
            ...prev,
            unlimitedTickets: checked,
            ticketCount: checked ? "" : prev.ticketCount, // clear input visually when unlimited
        }));
    };

    // Image change: append selected files to existing images
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setFormData((prev) => {
            const appended = [...prev.images, ...files];
            return { ...prev, images: appended };
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index) => {
        setFormData((prev) => {
            const filtered = prev.images.filter((_, i) => i !== index);
            if (filtered.length === 0 && fileInputRef.current) fileInputRef.current.value = "";
            return { ...prev, images: filtered };
        });
    };

    const searchLocation = async (query) => {
        if (!query.trim()) return setLocationSuggestions([]);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}&addressdetails=1&limit=7`,
                { headers: { "Accept-Language": "ar,en" } }
            );
            const data = await res.json();
            setLocationSuggestions(data);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    const handleLocationSelect = (lat, lon, displayName) => {
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setMarkerPosition(newPos);
        setFormData((prev) => ({ ...prev, location: displayName }));
        setLocationSuggestions([]);
    };

    const handleMapClick = async (coords) => {
        setMarkerPosition(coords);
        const name = await reverseGeocode(coords[0], coords[1]);
        setFormData((prev) => ({ ...prev, location: name }));
        setLocationSuggestions([]);
    };

    // VALIDATION
    const validate = () => {
        const newErrors = {};

        // required
        if (!formData.name.trim()) newErrors.name = "اسم الحدث مطلوب";
        if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (!formData.startDate) newErrors.startDate = "تاريخ البداية مطلوب";
        if (!formData.location.trim()) newErrors.location = "الموقع مطلوب";

        // durations: must be >= 0 and at least one > 0
        const days = formData.durationDays === "" ? 0 : Number(formData.durationDays);
        const hours = formData.durationHours === "" ? 0 : Number(formData.durationHours);

        if (Number.isNaN(days) || Number.isNaN(hours)) {
            newErrors.duration = "المدة غير صحيحة";
        } else {
            if (days < 0) newErrors.durationDays = "الأيام لا يمكن أن تكون سالبة";
            if (hours < 0) newErrors.durationHours = "الساعات لا يمكن أن تكون سالبة";
            if (!(days > 0 || hours > 0)) newErrors.duration = "يجب أن تكون المدة أكبر من صفر (ساعات أو أيام)";
        }

        // price and ticketCount: required only if not free / not unlimited
        if (!formData.freeEvent && (formData.price === "" || formData.price === null)) {
            newErrors.price = "سعر التذكرة مطلوب";
        } else if (!formData.freeEvent && Number(formData.price) <= 0) {
            newErrors.price = "سعر التذكرة يجب أن يكون أكبر من صفر";
        }

        if (!formData.unlimitedTickets && (formData.ticketCount === "" || formData.ticketCount === null)) {
            newErrors.ticketCount = "عدد التذاكر مطلوب";
        } else if (!formData.unlimitedTickets && Number(formData.ticketCount) <= 0) {
            newErrors.ticketCount = "عدد التذاكر يجب أن يكون أكبر من صفر";
        }

        // images required
        if (!formData.images || formData.images.length === 0) {
            newErrors.images = "يجب رفع صورة واحدة على الأقل";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const body = {
            name: formData.name,
            description: formData.description,
            longitude: markerPosition[1],
            latitude: markerPosition[0],
            place: formData.location,
            duration_days: Number(formData.durationDays) || 0,
            duration_hours: Number(formData.durationHours) || 0,
            tickets: formData.unlimitedTickets ? 0 : Number(formData.ticketCount || 0),
            price: formData.freeEvent ? 0 : Number(formData.price || 0),
            event_type: formData.unlimitedTickets ? "unlimited" : "limited",
            price_type: formData.freeEvent ? "free" : "paid",
            pre_booking: Number(formData.prebooking),
        };

        const payload = new FormData();
        Object.entries(body).forEach(([k, v]) => payload.append(k, v));
        formData.images.forEach((img, i) => payload.append(`images[${i}]`, img));

        console.log("Body JSON →", body);
        for (let p of payload.entries()) console.log(p[0], p[1]);
    };

    // derived image count (always correct)
    const imageCount = formData.images.length;

    // input css helpers (kept as in your UI style)
    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500";
    const fieldClass = (error) => `${baseInput} ${error ? errorInput : validInput}`;

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                <button
                    className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    type="button"
                >
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold text-green mb-6 text-right">إضافة حدث</h2>

                <form className="grid grid-cols-2 gap-4 items-start" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">اسم الحدث</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="اكتب اسم الحدث"
                            className={fieldClass(errors.name)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">الوصف</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="اكتب وصف الحدث"
                            className={`${fieldClass(errors.description)} h-28 resize-none`}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Duration */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">المدة</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="durationDays"
                                placeholder="بالأيام"
                                value={formData.durationDays}
                                onChange={handleChange}
                                className={`${fieldClass(errors.duration)} flex-1`}
                            />
                            <input
                                type="number"
                                name="durationHours"
                                placeholder="بالساعات"
                                value={formData.durationHours}
                                onChange={handleChange}
                                className={`${fieldClass(errors.duration)} flex-1`}
                            />
                        </div>
                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                        {errors.durationDays && <p className="text-red-500 text-sm mt-1">{errors.durationDays}</p>}
                        {errors.durationHours && <p className="text-red-500 text-sm mt-1">{errors.durationHours}</p>}
                    </div>

                    {/* Start Date */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">تاريخ البداية</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className={fieldClass(errors.startDate)}
                        />
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                    </div>

                    {/* Ticket Price */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">سعر التذكرة</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                name="price"
                                value={formData.freeEvent ? "" : formData.price}
                                onChange={handleChange}
                                disabled={formData.freeEvent}
                                className={`${fieldClass(errors.price)} ${formData.freeEvent ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            />
                            <span className="text-gray-500">$</span>
                        </div>
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-700">مجاني</span>
                            <Switch
                                checked={formData.freeEvent}
                                onChange={handleFreeToggle}
                                color="success"
                            />
                        </div>
                    </div>

                    {/* Ticket Count */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">عدد التذاكر</label>
                        <input
                            type="number"
                            name="ticketCount"
                            value={formData.unlimitedTickets ? "" : formData.ticketCount}
                            onChange={handleChange}
                            disabled={formData.unlimitedTickets}
                            className={`${fieldClass(errors.ticketCount)} ${formData.unlimitedTickets ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        />
                        {errors.ticketCount && <p className="text-red-500 text-sm mt-1">{errors.ticketCount}</p>}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-700">غير محدود</span>
                            <Switch
                                checked={formData.unlimitedTickets}
                                onChange={handleUnlimitedToggle}
                                color="success"
                            />
                        </div>
                    </div>

                    {/* LEFT COLUMN: Location -> Map -> Prebooking (grouped so no gap) */}
                    <div className="col-span-1">
                        {/* Location and suggestions */}
                        <div className="relative z-50">
                            <label className="block text-sm text-gray-700 mb-1">الموقع</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="ابحث عن مكان..."
                                value={formData.location}
                                onChange={(e) => {
                                    handleChange(e);
                                    searchLocation(e.target.value);
                                }}
                                className={fieldClass(errors.location)}
                            />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                            {locationSuggestions.length > 0 && (
                                <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto z-50">
                                    {locationSuggestions.map((place, idx) => (
                                        <li
                                            key={idx}
                                            onClick={() => handleLocationSelect(place.lat, place.lon, place.display_name)}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-right"
                                        >
                                            {place.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Map directly under the location (same column) */}
                        <div className="relative h-56 rounded-2xl overflow-hidden z-[1] mt-3">
                            <MapContainer center={markerPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <Marker position={markerPosition} />
                                <MapUpdater position={markerPosition} />
                                <MapClickHandler onClick={handleMapClick} />
                            </MapContainer>
                        </div>

                        {/* Pre-Booking under the map */}
                        <div className="flex items-center gap-6 mt-2">
                            <span className="text-sm text-gray-700">الحجز المسبق:</span>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="prebooking"
                                    value={0}
                                    checked={Number(formData.prebooking) === 0}
                                    onChange={handleChange}
                                />
                                لا
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="prebooking"
                                    value={1}
                                    checked={Number(formData.prebooking) === 1}
                                    onChange={handleChange}
                                />
                                نعم
                            </label>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Images (in place of previous map) */}
                    <div className="col-span-1">
                        <label className="block text-sm text-gray-700 mb-1">الصور</label>
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className={fieldClass(errors.images)}
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.images.map((file, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-[90px] h-[90px] border rounded-xl overflow-hidden group"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* image count */}
                        {imageCount > 0 && <p className="text-sm mt-2">{imageCount} ملفات</p>}
                        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                    </div>

                    {/* Submit */}
                    <div className="col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full bg-green text-white py-3 rounded-xl hover:bg-green-700 transition"
                        >
                            + إضافة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
