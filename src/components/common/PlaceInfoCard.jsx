// PlaceInfoCard.jsx
import { Star } from "lucide-react";
import pen from "@/assets/icons/event/pen.svg";
import bin from "@/assets/icons/event/bin.svg";
import SaveIcon from "@/assets/icons/sidebar/SaveIcon.svg";
import SavedIcon from "@/assets/icons/sidebar/unsave.svg"; // icon for unsave
import Map from "@/components/common/Map.jsx";
import React, { useState, useEffect } from "react";

export default function PlaceInfoCard({ data, onEdit, onDelete, isAdmin, onAdminSave, onAdminUnsave }) {
    if (!data) return null;

    const {
        id,
        type,
        name,
        number_of_branches,
        phone,
        country_code,
        city,
        place,
        longitude,
        latitude,
        rating,
        classification,
        description,
        is_saved = false,
    } = data;

    const [saved, setSaved] = useState(is_saved);

    const isTourist = type === "tourist";
    const position = longitude && latitude ? [parseFloat(latitude), parseFloat(longitude)] : null;

    useEffect(() => {
        setSaved(is_saved);
    }, [is_saved]);

    const handleAdminSaveClick = async () => {
        try {
            if (saved) {
                await onAdminUnsave?.(id);
                setSaved(false);
            } else {
                await onAdminSave?.(id);
                setSaved(true);
            }
        } catch (err) {
            console.error("Failed to toggle save state", err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <h1 className="text-h1-bold-32 text-(--text-title)">{name}</h1>
                </div>

                {rating >= 0 && (
                    <div className="flex items-center gap-2 text-yellow-600 font-semibold">
                        <span className="text-h1-bold-24 text-(--text-title)">متوسط التقييمات:</span>
                        <span className="flex items-center gap-1 text-xl">
                            {rating}
                            <span className="pb-1"><Star size={18} fill="currentColor" /></span>
                        </span>
                    </div>
                )}

                <div className="flex gap-3">
                    {onEdit && onDelete ? (
                        <>
                            <ActionButton label="تعديل" icon={pen} variant="outline" onClick={onEdit} />
                            <ActionButton label="حذف" icon={bin} variant="danger" onClick={onDelete} />
                        </>
                    ) : isAdmin ? (
                        <ActionButton
                            label={saved ? "تم الحفظ" : "حفظ"}
                            icon={saved ? SavedIcon : SaveIcon}
                            variant={saved ? "saved" : "outline"}
                            onClick={handleAdminSaveClick}
                        />
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <InfoItem label="الرقم التعريفي" value={id} />
                <InfoItem label="المحافظة" value={city ?? "-"} />
                {!isTourist && number_of_branches > 0 && <InfoItem label="عدد الأفرع" value={number_of_branches} />}
                {!isTourist && phone && <InfoItem label="رقم الهاتف" value={`${phone} ${country_code.slice(1) || ""}+`} />}
                {isTourist ? (
                    <>
                        {description && <InfoItem label="الوصف" value={description} />}
                        {classification && <InfoItem label="التصنيف" value={classification} />}
                        {position && (
                            <div className="md:col-span-2">
                                <h2 className="text-body-bold-16 text-(--text-title) pb-1 text-right">الموقع</h2>
                                <p className="text-right pb-3">{place}</p>
                                <Map position={position} width="100%" height={300} borderColor="green" borderWidth={4} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {position && (
                            <div>
                                <h2 className="text-body-bold-16 text-(--text-title) pb-1 text-right">الموقع</h2>
                                <p className="text-right pb-3">{place}</p>
                                <Map position={position} width="65%" height={200} borderColor="green" borderWidth={4} />
                            </div>
                        )}
                        {description && <InfoItem label="الوصف" value={description} />}
                    </>
                )}
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-body-bold-16 text-(--text-title) pb-1">{label}</p>
            <p className="text-(--text-paragraph)">{value}</p>
        </div>
    );
}

function ActionButton({ label, icon, variant, onClick }) {
    const base = "flex items-center gap-2 px-5 py-2 rounded-full text-body-bold-14 hover:shadow-lg cursor-pointer transition-all duration-200";
    const variants = {
        outline: "text-green border-green border-2 hover:bg-green-50",
        danger: "bg-red text-white hover:bg-red-500",
        saved: "bg-green text-white hover:shadow-md",
    };
    return (
        <button onClick={onClick} className={`${base} ${variants[variant]}`}>
            {label}
            <img src={icon} alt={label} className="w-4 h-4" />
        </button>
    );
}
