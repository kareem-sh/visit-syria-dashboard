import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { X as XIcon, Trash2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import pen from "@/assets/icons/event/white pen.svg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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
    useMapEvent("click", (e) => onClick([e.latlng.lat, e.latlng.lng]));
    return null;
}

function SuggestionPortal({ inputRef, suggestions = [], onSelect, visible }) {
    const [rect, setRect] = useState(null);
    useLayoutEffect(() => {
        if (!visible || !inputRef?.current) {
            setRect(null);
            return;
        }
        const update = () => {
            const r = inputRef.current.getBoundingClientRect();
            setRect(r);
        };
        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [inputRef, visible, suggestions]);

    if (!visible || !rect || suggestions.length === 0) return null;

    const style = {
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
    };

    return ReactDOM.createPortal(
        <ul
            style={style}
            className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto text-sm text-right"
        >
            {suggestions.map((p, idx) => (
                <li
                    key={idx}
                    onClick={() => onSelect(p.lat, p.lon, p.display_name)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                    {p.display_name}
                </li>
            ))}
        </ul>,
        document.body
    );
}

export default function EventEditDialog({ isOpen, onClose, onSave, initialData = {} }) {
    const fileInputRef = useRef(null);
    const placeInputRef = useRef(null);
    const MAX_IMAGES = 4;
    const defaultPos =
        initialData.latitude && initialData.longitude
            ? [Number(initialData.latitude), Number(initialData.longitude)]
            : [33.5138, 36.2765];

    const [name, setName] = useState(initialData.name || "");
    const [description, setDescription] = useState(initialData.description || "");
    const [place, setPlace] = useState(initialData.place || "");
    const [markerPosition, setMarkerPosition] = useState(defaultPos);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    /**
     * images: array of objects:
     * { file: File | null, url: string | null, preview: string | null }
     * - For existing images: url (original), preview = url, file may be set after fetching blob
     * - For newly selected images: file is File, preview is blob: URL
     */
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [uploadWarning, setUploadWarning] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Load & normalize initial data when dialog opens
    useEffect(() => {
        if (!isOpen) return;

        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setPlace(initialData.place || "");
        setMarkerPosition(
            initialData.latitude && initialData.longitude
                ? [Number(initialData.latitude), Number(initialData.longitude)]
                : defaultPos
        );
        setErrors({});
        setUploadWarning("");
        setLocationSuggestions([]);
        setIsSearching(false);

        // Normalize initialData.images to up-to-MAX_IMAGES items.
        // Accept initialData.images as an array of { url } or strings (urls).
        async function loadOldImages() {
            const raw = (initialData.images || []).slice(0, MAX_IMAGES);
            const converted = await Promise.all(
                raw.map(async (entry) => {
                    const url = typeof entry === "string" ? entry : entry?.url || entry?.preview || null;
                    if (!url) return null;
                    try {
                        // try fetch the image and create a File so it can be re-uploaded as a File
                        const res = await fetch(url);
                        const blob = await res.blob();
                        const filename = url.split("/").pop().split("?")[0] || `image.${blob.type.split("/")[1] || "jpg"}`;
                        const file = new File([blob], filename, { type: blob.type });
                        return { file, url, preview: url };
                    } catch (err) {
                        // If fetch fails, still keep preview as url but file null.
                        // We'll attempt to convert url->File on Save.
                        return { file: null, url, preview: url };
                    }
                })
            );
            // filter out any null entries and set state
            setImages(converted.filter(Boolean));
        }
        loadOldImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    const revokePreviewIfBlob = (preview) => {
        try {
            if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
        } catch {}
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            setUploadWarning(`لا يمكن رفع أكثر من ${MAX_IMAGES} صور.`);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        const accepted = files.slice(0, remaining);
        const withPreviews = accepted.map((file) => ({
            file,
            url: null,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...withPreviews]);

        if (files.length > remaining) setUploadWarning(`تمت إضافة ${remaining} صور فقط — الحد الأقصى ${MAX_IMAGES}.`);
        else setUploadWarning("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const clone = [...prev];
            const removed = clone.splice(index, 1)[0];
            if (removed?.preview && removed.preview.startsWith("blob:")) {
                revokePreviewIfBlob(removed.preview);
            }
            return clone;
        });
    };

    const doSearch = (query) => {
        if (query == null) return;
        if (isSearching) return;
        if (!query || !query.trim()) {
            setLocationSuggestions([]);
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        // debounce simple implementation
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=7`,
                    { headers: { "Accept-Language": "ar,en" } }
                );
                const data = await res.json();
                setLocationSuggestions(data || []);
            } catch (err) {
                console.error("location search error", err);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
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

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "اسم الحدث مطلوب";
        if (!description.trim()) newErrors.description = "الوصف مطلوب";
        if (!place.trim()) newErrors.place = "الموقع مطلوب";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Ensure all images have File objects before sending.
    // If some existing images couldn't be fetched earlier (file === null) we'll attempt to fetch here.
    async function ensureAllImagesHaveFiles(currentImages) {
        const results = await Promise.all(
            currentImages.map(async (img) => {
                if (img.file instanceof File) return img;
                if (img.url) {
                    try {
                        const res = await fetch(img.url);
                        const blob = await res.blob();
                        const filename = img.url.split("/").pop().split("?")[0] || `image.${blob.type.split("/")[1] || "jpg"}`;
                        const file = new File([blob], filename, { type: blob.type });
                        return { ...img, file };
                    } catch (err) {
                        // If fetch fails, omit this image (do not send it).
                        // Returning null will filter it out later.
                        return null;
                    }
                }
                // no file and no url -> skip
                return null;
            })
        );
        return results.filter(Boolean);
    }

    const handleSave = async (e) => {
        e?.preventDefault?.();
        if (!validate()) return;

        try {
            setIsSaving(true);
            // Make sure any remaining entries with url (but no file) are converted to files now
            const normalized = await ensureAllImagesHaveFiles(images);
            // Now create payload images array of File objects
            const filesToSend = normalized.map((it) => it.file).filter(Boolean);
            const payload = {
                name: name.trim(),
                description: description.trim(),
                place: place.trim(),
                latitude: markerPosition[0],
                longitude: markerPosition[1],
                images: filesToSend, // send only visible images as Files
            };
            await onSave(payload);
            setIsSaving(false);
            onClose();
        } catch (err) {
            console.error("onSave failed", err);
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500";
    const fieldClass = (e) => `${baseInput} ${e ? errorInput : validInput}`;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-99999" onClick={onClose}>
            <div className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-6 relative overflow-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()} dir="rtl">
                <button className="absolute top-4 left-4 text-gray-500 hover:text-gray-700" onClick={onClose}><XIcon/></button>
                <h2 className="text-2xl font-bold text-green mb-4 text-right">تعديل الحدث</h2>

                <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm mb-1 text-gray-700">اسم الحدث</label>
                        <input value={name} onChange={(e)=>setName(e.target.value)} className={fieldClass(errors.name)} placeholder="اكتب اسم الحدث"/>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block mb-1 text-sm text-gray-700">الوصف</label>
                        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className={`${fieldClass(errors.description)} h-28 resize-none`} placeholder="اكتب وصف الحدث"/>
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm text-gray-700">الموقع</label>
                        <div className="relative">
                            <input
                                ref={placeInputRef}
                                type="text"
                                placeholder="ابحث عن مكان..."
                                value={place}
                                onChange={(e) => {
                                    setPlace(e.target.value);
                                    // use simple debounce pattern
                                    if (doSearch) doSearch(e.target.value);
                                }}
                                className={fieldClass(errors.place)}
                            />
                            {errors.place && <p className="text-red-500 text-sm mt-1">{errors.place}</p>}
                        </div>

                        <SuggestionPortal
                            inputRef={placeInputRef}
                            suggestions={locationSuggestions}
                            onSelect={(lat, lon, name) => {
                                setMarkerPosition([parseFloat(lat), parseFloat(lon)]);
                                setPlace(name);
                                setLocationSuggestions([]);
                            }}
                            visible={locationSuggestions.length > 0}
                        />

                        <div className="relative z-10 h-48 rounded-2xl overflow-hidden mt-2">
                            <MapContainer center={markerPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={markerPosition}/>
                                <MapUpdater position={markerPosition}/>
                                <MapClickHandler onClick={async(coords)=>{
                                    setMarkerPosition(coords);
                                    const nameResp = await reverseGeocode(coords[0], coords[1]);
                                    setPlace(nameResp);
                                }}/>
                            </MapContainer>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">اضغط على الخريطة لتعيين الموقع</p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">الصور</label>
                        <input type="file" multiple disabled={images.length>=MAX_IMAGES} ref={fileInputRef} onChange={handleImageChange} className={fieldClass(false)} />
                        {uploadWarning && <p className="text-yellow-600 text-sm mt-1">{uploadWarning}</p>}
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square border rounded-xl overflow-hidden group">
                                    <img src={img.preview || img.url} className="object-cover w-full h-full" alt={`img-${idx}`}/>
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/40 flex items-center justify-center">
                                        <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 rounded-full text-white">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">الحد الأقصى {MAX_IMAGES} صور</p>
                    </div>

                    <div className="col-span-2 mt-2">
                        <button type="submit" disabled={isSaving} className="w-full flex gap-2 justify-center items-center rounded-full bg-green px-6 py-3 text-white disabled:opacity-50">
                            <img src={pen} className="w-4 h-4" alt=""/> {isSaving ? "جاري الحفظ..." : "تعديل"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
