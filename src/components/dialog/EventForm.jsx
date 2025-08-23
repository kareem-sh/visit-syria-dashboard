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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "@/services/events/eventsApi.js";
import SuccessDialog from "@/components/dialog/SuccessDialog"; // adjust path if needed

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

const initialForm = {
    name: "",
    description: "",
    date: "",
    price: "",
    tickets: "",
    duration_days: "",
    duration_hours: "",
    pre_booking: 0,
    event_type: "limited",
    price_type: "paid",
    place: "",
    // images will be array of { file, url }
    images: [],
};

export default function EventForm({ onClose }) {
    const queryClient = useQueryClient();

    // Local state for success dialog
    const [successOpen, setSuccessOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            // Refresh events list
            queryClient.invalidateQueries({ queryKey: ["events"] });
            // Show success animation
            setSuccessOpen(true);
            // Clear the form for a new event (don't close modal)
            resetForm();
        },
        onError: (err) => {
            console.error("Error creating event →", err);
        },
    });

    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const [markerPosition, setMarkerPosition] = useState([33.5138, 36.2765]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    // helper to revoke preview urls
    const revokeAllPreviewUrls = (imagesArray) => {
        imagesArray.forEach((i) => {
            try {
                if (i && i.url) URL.revokeObjectURL(i.url);
            } catch (e) {
                // ignore
            }
        });
    };

    const resetForm = () => {
        // revoke previous preview urls
        revokeAllPreviewUrls(formData.images);
        setFormData(initialForm);
        if (fileInputRef.current) fileInputRef.current.value = "";
        // optional: reset marker to default
        setMarkerPosition([33.5138, 36.2765]);
        setErrors({});
    };

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "pre_booking") {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFreeToggle = (_, checked) => {
        setFormData((prev) => ({
            ...prev,
            price_type: checked ? "free" : "paid",
            price: checked ? "" : prev.price,
        }));
    };

    const handleUnlimitedToggle = (_, checked) => {
        setFormData((prev) => ({
            ...prev,
            event_type: checked ? "unlimited" : "limited",
            tickets: checked ? "" : prev.tickets,
        }));
    };

    // store preview urls alongside files so we can revoke later
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const withPreviews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...withPreviews],
        }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index) => {
        setFormData((prev) => {
            const removed = prev.images[index];
            // revoke URL for removed file
            try {
                if (removed && removed.url) URL.revokeObjectURL(removed.url);
            } catch (e) {}
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
        setFormData((prev) => ({ ...prev, place: displayName }));
        setLocationSuggestions([]);
    };

    const handleMapClick = async (coords) => {
        setMarkerPosition(coords);
        const name = await reverseGeocode(coords[0], coords[1]);
        setFormData((prev) => ({ ...prev, place: name }));
        setLocationSuggestions([]);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "اسم الحدث مطلوب";
        if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (!formData.date) newErrors.date = "التاريخ مطلوب";
        if (!formData.place.trim()) newErrors.place = "الموقع مطلوب";

        const days = formData.duration_days === "" ? 0 : Number(formData.duration_days);
        const hours = formData.duration_hours === "" ? 0 : Number(formData.duration_hours);
        if (Number.isNaN(days) || Number.isNaN(hours)) {
            newErrors.duration = "المدة غير صحيحة";
        } else {
            if (days < 0) newErrors.duration_days = "الأيام لا يمكن أن تكون سالبة";
            if (hours < 0) newErrors.duration_hours = "الساعات لا يمكن أن تكون سالبة";
            if (!(days > 0 || hours > 0)) newErrors.duration = "يجب أن تكون المدة أكبر من صفر";
        }

        if (formData.price_type === "paid" && (formData.price === "" || Number(formData.price) <= 0)) {
            newErrors.price = "سعر التذكرة مطلوب ويجب أن يكون > 0";
        }
        if (formData.event_type === "limited" && (formData.tickets === "" || Number(formData.tickets) <= 0)) {
            newErrors.tickets = "عدد التذاكر مطلوب ويجب أن يكون > 0";
        }
        if (!formData.images || formData.images.length === 0) {
            newErrors.images = "يجب رفع صورة واحدة على الأقل";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const body = {
            name: formData.name,
            description: formData.description,
            longitude: markerPosition[1],
            latitude: markerPosition[0],
            place: formData.place,
            date: formData.date,
            duration_days: Number(formData.duration_days) || 0,
            duration_hours: Number(formData.duration_hours) || 0,
            tickets: formData.event_type === "unlimited" ? 0 : Number(formData.tickets || 0),
            price: formData.price_type === "free" ? 0 : Number(formData.price || 0),
            event_type: formData.event_type,
            price_type: formData.price_type,
            pre_booking: Number(formData.pre_booking),
            // send original File objects to API
            images: formData.images.map((i) => i.file),
        };

        mutation.mutate(body);
    };

    const imageCount = formData.images.length;

    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500";
    const fieldClass = (error) => `${baseInput} ${error ? errorInput : validInput}`;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-99999"
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
                                    name="duration_days"
                                    placeholder="بالأيام"
                                    value={formData.duration_days}
                                    onChange={handleChange}
                                    className={`${fieldClass(errors.duration)} flex-1`}
                                />
                                <input
                                    type="number"
                                    name="duration_hours"
                                    placeholder="بالساعات"
                                    value={formData.duration_hours}
                                    onChange={handleChange}
                                    className={`${fieldClass(errors.duration)} flex-1`}
                                />
                            </div>
                            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                            {errors.duration_days && <p className="text-red-500 text-sm mt-1">{errors.duration_days}</p>}
                            {errors.duration_hours && <p className="text-red-500 text-sm mt-1">{errors.duration_hours}</p>}
                        </div>

                        {/* Date */}
                        <div className="col-span-1">
                            <label className="block text-sm text-gray-700 mb-1">تاريخ الحدث</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={fieldClass(errors.date)}
                            />
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </div>

                        {/* Ticket Price */}
                        <div className="col-span-1">
                            <label className="block text-sm text-gray-700 mb-1">سعر التذكرة</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price_type === "free" ? "" : formData.price}
                                    onChange={handleChange}
                                    disabled={formData.price_type === "free"}
                                    className={`${fieldClass(errors.price)} ${
                                        formData.price_type === "free"
                                            ? "bg-gray-100 cursor-not-allowed"
                                            : ""
                                    }`}
                                />
                                <span className="text-gray-500">$</span>
                            </div>
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-700">مجاني</span>
                                <Switch checked={formData.price_type === "free"} onChange={handleFreeToggle} color="success" />
                            </div>
                        </div>

                        {/* Ticket Count */}
                        <div className="col-span-1">
                            <label className="block text-sm text-gray-700 mb-1">عدد التذاكر</label>
                            <input
                                type="number"
                                name="tickets"
                                value={formData.event_type === "unlimited" ? "" : formData.tickets}
                                onChange={handleChange}
                                disabled={formData.event_type === "unlimited"}
                                className={`${fieldClass(errors.tickets)} ${
                                    formData.event_type === "unlimited"
                                        ? "bg-gray-100 cursor-not-allowed"
                                        : ""
                                }`}
                            />
                            {errors.tickets && <p className="text-red-500 text-sm mt-1">{errors.tickets}</p>}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-700">غير محدود</span>
                                <Switch checked={formData.event_type === "unlimited"} onChange={handleUnlimitedToggle} color="success" />
                            </div>
                        </div>

                        {/* Location + Map + Prebooking */}
                        <div className="col-span-1">
                            <div className="relative z-50">
                                <label className="block text-sm text-gray-700 mb-1">الموقع</label>
                                <input
                                    type="text"
                                    name="place"
                                    placeholder="ابحث عن مكان..."
                                    value={formData.place}
                                    onChange={(e) => {
                                        handleChange(e);
                                        searchLocation(e.target.value);
                                    }}
                                    className={fieldClass(errors.place)}
                                />
                                {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
                                {locationSuggestions.length > 0 && (
                                    <ul className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto z-50">
                                        {locationSuggestions.map((place, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() =>
                                                    handleLocationSelect(place.lat, place.lon, place.display_name)
                                                }
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-right"
                                            >
                                                {place.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="relative h-56 rounded-2xl overflow-hidden z-[1] mt-3">
                                <MapContainer
                                    center={markerPosition}
                                    zoom={15}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="&copy; OpenStreetMap contributors"
                                    />
                                    <Marker position={markerPosition} />
                                    <MapUpdater position={markerPosition} />
                                    <MapClickHandler onClick={handleMapClick} />
                                </MapContainer>
                            </div>

                            <div className="flex items-center gap-6 mt-2">
                                <span className="text-sm text-gray-700">الحجز المسبق:</span>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="pre_booking"
                                        value={0}
                                        checked={Number(formData.pre_booking) === 0}
                                        onChange={handleChange}
                                    />
                                    لا
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="pre_booking"
                                        value={1}
                                        checked={Number(formData.pre_booking) === 1}
                                        onChange={handleChange}
                                    />
                                    نعم
                                </label>
                            </div>
                        </div>

                        {/* Images */}
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
                                {formData.images.map((entry, idx) => (
                                    <div key={idx} className="relative w-[90px] h-[90px] border rounded-xl overflow-hidden group">
                                        <img src={entry.url} alt={entry.file.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                            <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {imageCount > 0 && <p className="text-sm mt-2">{imageCount} ملفات</p>}
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                        </div>

                        {/* Submit button */}
                        <div className="col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="w-full bg-green text-white py-3 rounded-xl hover:shadow-md transition disabled:opacity-50"
                            >
                                {mutation.isLoading ? "جاري الإضافة..." : "+ إضافة"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* success dialog */}
            <SuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message="تمت الإضافة بنجاح"
            />
        </>
    );
}
