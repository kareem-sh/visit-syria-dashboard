import React, { useState } from "react";
import { X, Plus, Trash2, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import MapSearchPicker from "@/components/common/MapSearchPicker";
import { Switch } from "@mui/material";

const TripDialog = ({
                        isOpen,
                        onClose,
                        onSave,
                        mode = "create",
                        initialData = {},
                        isLoading = false
                    }) => {
    // ---- Initializers ----
    const initBasic = () => {
        const today = new Date().toISOString().split("T")[0];
        const base = {
            name: "",
            description: "",
            season: "",
            start_date: today,
            days: 1,
            tickets: "",
            price: "",
            discount: 0,
            discount_enabled: false,
            tags: [],
            images: []
        };
        const merged = { ...base, ...(initialData || {}) };
        merged.days = Number(merged.days) || 1;
        return merged;
    };

    const initTimelines = () => {
        const basic = initBasic();
        const daysCount = Number(basic.days) || 1;
        const initialTimelines = Array.isArray(initialData.timelines) ? initialData.timelines : [];
        const out = [];

        for (let i = 0; i < daysCount; i++) {
            if (initialTimelines[i]) {
                out.push({
                    ...initialTimelines[i],
                    sections: Array.isArray(initialTimelines[i].sections)
                        ? initialTimelines[i].sections.map(s => ({
                            ...s,
                            description: Array.isArray(s.description) ? [...s.description] : [""],
                            latitude: s.latitude || null,
                            longitude: s.longitude || null
                        }))
                        : [{
                            time: "",
                            title: "",
                            description: [""],
                            latitude: null,
                            longitude: null
                        }]
                });
            } else {
                out.push({
                    day: i + 1,
                    sections: [
                        {
                            time: "",
                            title: "",
                            description: [""],
                            latitude: null,
                            longitude: null
                        }
                    ]
                });
            }
        }
        return out;
    };

    const initImprovementsArray = () => {
        return Array.isArray(initialData.improvements) ? [...initialData.improvements] : [];
    };

    // ---- State ----
    const [basicInfo, setBasicInfo] = useState(initBasic);
    const [timelines, setTimelines] = useState(initTimelines);
    const [improvementsText, setImprovementsText] = useState(() => (initImprovementsArray().join("\n")));
    const [errorsBasic, setErrorsBasic] = useState({});
    const [errorsTimeline, setErrorsTimeline] = useState({});
    const [expandedDays, setExpandedDays] = useState({ 0: true });
    const [step, setStep] = useState(1);

    const categories = [
        "أثرية", "طبيعية", "طعام", "دينية", "تاريخية", "ثقافية", "عادات وتقاليد", "ترفيهية"
    ];

    if (!isOpen) return null;

    // ---- Utilities ----
    const getTodayDate = () => new Date().toISOString().split("T")[0];
    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition bg-white";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500";
    const disabledInput = "bg-gray-100 text-gray-500 cursor-not-allowed";
    const fieldClass = (error, disabled = false) =>
        `${baseInput} ${error ? errorInput : validInput} ${disabled ? disabledInput : ""}`;

    // ---- Basic handlers ----
    const handleBasicChange = (field, value) => {
        if (field === "days") {
            const daysValue = Math.max(1, Number(value) || 1);
            setBasicInfo(prev => ({ ...prev, days: daysValue }));

            setTimelines(prev => {
                const current = Array.isArray(prev) ? prev : [];
                if (current.length === daysValue) return current;

                if (current.length < daysValue) {
                    const newTimelines = [...current];
                    for (let i = current.length; i < daysValue; i++) {
                        newTimelines.push({
                            day: i + 1,
                            sections: [
                                {
                                    time: "",
                                    title: "",
                                    description: [""],
                                    latitude: null,
                                    longitude: null
                                }
                            ]
                        });
                    }
                    return newTimelines;
                } else {
                    return current.slice(0, daysValue);
                }
            });

            if (errorsBasic.days) setErrorsBasic(prev => ({ ...prev, days: null }));
            return;
        }

        if (field === "discount_enabled") {
            setBasicInfo(prev => ({
                ...prev,
                discount_enabled: value,
                discount: value ? prev.discount : 0
            }));
            return;
        }

        setBasicInfo(prev => ({ ...prev, [field]: value }));
        if (errorsBasic[field]) setErrorsBasic(prev => ({ ...prev, [field]: null }));
    };

    const handleTagToggle = (tag) => {
        setBasicInfo(prev => {
            const tags = Array.isArray(prev.tags) ? prev.tags : [];
            const newTags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
            return { ...prev, tags: newTags };
        });
        if (errorsBasic.tags) setErrorsBasic(prev => ({ ...prev, tags: null }));
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const imageFiles = files.filter(file =>
            file instanceof File &&
            file.type.startsWith('image/') &&
            file.size > 0
        );

        setBasicInfo(prev => ({
            ...prev,
            images: [...(prev.images || []), ...imageFiles]
        }));

        if (errorsBasic.images) setErrorsBasic(prev => ({ ...prev, images: null }));
        e.target.value = '';
    };

    const handleImageRemove = (index) => {
        setBasicInfo(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    // ---- Timeline handlers ----
    const handleTimelineSectionAdd = (dayIndex) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: [...(tl.sections || []), {
                    time: "",
                    title: "",
                    description: [""],
                    latitude: null,
                    longitude: null
                }]
            } : tl
        ));
    };

    const handleTimelineSectionRemove = (dayIndex, sectionIndex) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: tl.sections.filter((_, idx) => idx !== sectionIndex)
            } : tl
        ));
    };

    const handleDescriptionLineAdd = (dayIndex, sectionIndex) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: tl.sections.map((s, si) =>
                    si === sectionIndex ? {
                        ...s,
                        description: [...(s.description || []), ""]
                    } : s
                )
            } : tl
        ));
    };

    const handleDescriptionLineRemove = (dayIndex, sectionIndex, descIndex) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: tl.sections.map((s, si) =>
                    si === sectionIndex ? {
                        ...s,
                        description: (s.description || []).filter((_, d) => d !== descIndex)
                    } : s
                )
            } : tl
        ));
    };

    const handleDescriptionChange = (dayIndex, sectionIndex, descIndex, value) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: tl.sections.map((s, si) =>
                    si === sectionIndex ? {
                        ...s,
                        description: (s.description || []).map((d, di) =>
                            di === descIndex ? value : d
                        )
                    } : s
                )
            } : tl
        ));
    };

    const handleSectionFieldChange = (dayIndex, sectionIndex, field, value) => {
        setTimelines(prev => prev.map((tl, i) =>
            i === dayIndex ? {
                ...tl,
                sections: tl.sections.map((s, si) =>
                    si === sectionIndex ? {
                        ...s,
                        [field]: value
                    } : s
                )
            } : tl
        ));

        setErrorsTimeline(prev => {
            const copy = { ...prev };
            Object.keys(copy).forEach(k => {
                if (k.startsWith(`timeline-${dayIndex}-${sectionIndex}-`)) {
                    delete copy[k];
                }
            });
            return copy;
        });
    };

    const toggleDayAccordion = (dayIndex) => {
        setExpandedDays(prev => ({ ...prev, [dayIndex]: !prev[dayIndex] }));
    };

    const handleImprovementsTextChange = (value) => {
        setImprovementsText(value);
    };

    // ---- Validations ----
    const validateBasic = () => {
        const today = new Date().toISOString().split("T")[0];
        const newErr = {};

        if (!basicInfo.name) newErr.name = "اسم الرحلة مطلوب";
        if (!basicInfo.description) newErr.description = "الوصف مطلوب";
        if (!basicInfo.season) newErr.season = "الموسم مطلوب";
        if (!basicInfo.start_date) newErr.start_date = "تاريخ البدء مطلوب";
        else if (basicInfo.start_date < today) newErr.start_date = "التاريخ يجب أن يكون اليوم أو في المستقبل";
        if (!basicInfo.days || basicInfo.days < 1) newErr.days = "عدد الأيام يجب أن يكون 1 على الأقل";
        if (!basicInfo.tickets || basicInfo.tickets < 1) newErr.tickets = "عدد التذاكر مطلوب";
        if (basicInfo.price === "" || basicInfo.price === null || Number(basicInfo.price) < 0) newErr.price = "السعر مطلوب";
        if (basicInfo.discount_enabled && (basicInfo.discount === "" || basicInfo.discount === null || Number(basicInfo.discount) < 0)) newErr.discount = "الخصم مطلوب عند التفعيل";
        // if (!basicInfo.tags || basicInfo.tags.length === 0) newErr.tags = "يجب إضافة علامة واحدة على الأقل";

        const validImages = (basicInfo.images || []).filter(img =>
            img instanceof File && img.size > 0
        );
        if (validImages.length === 0) newErr.images = "يجب إضافة صورة واحدة على الأقل";

        setErrorsBasic(newErr);
        return Object.keys(newErr).length === 0;
    };

    const validateTimelines = () => {
        const newErr = {};
        timelines.forEach((timeline, dayIndex) => {
            (timeline.sections || []).forEach((section, sectionIndex) => {
                if (!section.time) newErr[`timeline-${dayIndex}-${sectionIndex}-time`] = "الوقت مطلوب";
                if (!section.title) newErr[`timeline-${dayIndex}-${sectionIndex}-title`] = "العنوان مطلوب";
                if (!section.description || section.description.some(d => !d.trim())) newErr[`timeline-${dayIndex}-${sectionIndex}-description`] = "جميع أسطر الوصف مطلوبة";
                if (!section.latitude || !section.longitude) newErr[`timeline-${dayIndex}-${sectionIndex}-location`] = "الموقع مطلوب";
            });
        });
        setErrorsTimeline(newErr);
        return Object.keys(newErr).length === 0;
    };

    // ---- Navigation handlers ----
    const handleBasicNext = () => {
        if (!validateBasic()) return;
        setStep(2);
        setExpandedDays({ 0: true });
    };

    const handleTimelineBack = () => {
        setStep(1);
    };

    const handleTimelineNextOrSave = () => {
        if (!validateTimelines()) return;

        const validImages = (basicInfo.images || []).filter(img =>
            img instanceof File && img.size > 0
        );

        if (validImages.length === 0 && mode === "create") {
            setErrorsBasic(prev => ({ ...prev, images: "يجب إضافة صورة واحدة على الأقل" }));
            return;
        }

        if (mode === "reactivate") {
            setStep(3);
        } else {
            // For create mode, don't include improvements
            const combined = prepareTripData(validImages, []);
            onSave(combined);
        }
    };

    const handleImprovementsBack = () => {
        setStep(2);
    };

    const handleFinalSave = () => {
        const validImages = (basicInfo.images || []).filter(img =>
            img instanceof File && img.size > 0
        );

        if (validImages.length === 0 && mode === "create") {
            setErrorsBasic(prev => ({ ...prev, images: "يجب إضافة صورة واحدة على الأقل" }));
            return;
        }

        // Only process improvements for reactivate mode
        const improvs = mode === "reactivate"
            ? improvementsText.split("\n").map(s => s.trim()).filter(Boolean)
            : [];

        const combined = prepareTripData(validImages, improvs);
        onSave(combined);
    };

    // ---- Data preparation ----
    const prepareTripData = (validImages, improvements = []) => {
        // The createTrip function expects a single 'images' array with File objects.
        const filesToUpload = validImages.filter(img => img instanceof File);

        const cleanedTimelines = timelines.map((timeline, index) => ({
            day: index + 1,
            sections: (timeline.sections || []).map(section => ({
                time: section?.time || "",
                title: section?.title || "",
                description: Array.isArray(section?.description)
                    ? section.description.filter(d => d && d.trim() !== "")
                    : [],
                latitude: section?.latitude ? String(section.latitude) : null,
                longitude: section?.longitude ? String(section.longitude) : null
            })).filter(section =>
                section.time || section.title || (section.description && section.description.length > 0)
            )
        })).filter(timeline => timeline.sections && timeline.sections.length > 0);

        // Return the exact structure the API function needs
        const tripData = {
            ...basicInfo,
            images: filesToUpload, // CORRECTED: Use a single 'images' key with files.
            timelines: cleanedTimelines,
            days: Number(basicInfo.days) || 1,
            tickets: Number(basicInfo.tickets) || 0,
            price: Number(basicInfo.price) || 0,
            discount: basicInfo.discount_enabled ? Number(basicInfo.discount) || 0 : 0,
            discount_enabled: Boolean(basicInfo.discount_enabled),
            tags: Array.isArray(basicInfo.tags) ? basicInfo.tags : []
        };

        // Only include improvements in reactivate mode
        if (mode === "reactivate") {
            tripData.improvements = improvements;
        }

        return tripData;
    };
    // ---- JSX for steps ----
    const BasicStep = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 font-bold text-gray-700 hover:text-gray-900 cursor-pointer">✕</button>

                <h2 className="text-right text-h1-bold-32 text-green mb-6">
                    {mode === "reactivate" ? "إعادة تفعيل رحلة - معلومات أساسية" : mode === "edit" ? "تعديل الرحلة - معلومات أساسية" : "إنشاء رحلة - معلومات أساسية"}
                </h2>

                <div className="space-y-6">
                    {/* Name & Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الرحلة *</label>
                            <input type="text" value={basicInfo.name} onChange={(e) => handleBasicChange('name', e.target.value)} className={fieldClass(errorsBasic.name)} placeholder="اسم الرحلة" />
                            {errorsBasic.name && <p className="text-red-500 text-sm mt-1">{errorsBasic.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
                            <textarea value={basicInfo.description} onChange={(e) => handleBasicChange('description', e.target.value)} rows={4} className={`${fieldClass(errorsBasic.description)} resize-none`} placeholder="وصف الرحلة" />
                            {errorsBasic.description && <p className="text-red-500 text-sm mt-1">{errorsBasic.description}</p>}
                        </div>
                    </div>

                    {/* Start Date & Days */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البدء *</label>
                            <input type="date" value={basicInfo.start_date} onChange={(e) => handleBasicChange('start_date', e.target.value)} min={getTodayDate()} className={fieldClass(errorsBasic.start_date)} />
                            {errorsBasic.start_date && <p className="text-red-500 text-sm mt-1">{errorsBasic.start_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">عدد الأيام *</label>
                            <input type="number" value={basicInfo.days} onChange={(e) => handleBasicChange('days', parseInt(e.target.value) || 1)} min="1" className={fieldClass(errorsBasic.days)} />
                            {errorsBasic.days && <p className="text-red-500 text-sm mt-1">{errorsBasic.days}</p>}
                        </div>
                    </div>

                    {/* Tickets & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">عدد التذاكر *</label>
                            <input type="number" value={basicInfo.tickets} onChange={(e) => handleBasicChange('tickets', parseInt(e.target.value) || 0)} min="1" className={fieldClass(errorsBasic.tickets)} />
                            {errorsBasic.tickets && <p className="text-red-500 text-sm mt-1">{errorsBasic.tickets}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">السعر ($) *</label>
                            <input type="number" value={basicInfo.price} onChange={(e) => handleBasicChange('price', parseFloat(e.target.value) || 0)} min="0" step="0.01" className={fieldClass(errorsBasic.price)} />
                            {errorsBasic.price && <p className="text-red-500 text-sm mt-1">{errorsBasic.price}</p>}
                        </div>
                    </div>

                    {/* Season & Discount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الموسم *</label>
                            <select value={basicInfo.season} onChange={(e) => handleBasicChange('season', e.target.value)} className={fieldClass(errorsBasic.season)}>
                                <option value="">اختر الموسم</option>
                                <option value="الربيع">الربيع</option>
                                <option value="الصيف">الصيف</option>
                                <option value="الخريف">الخريف</option>
                                <option value="الشتاء">الشتاء</option>
                            </select>
                            {errorsBasic.season && <p className="text-red-500 text-sm mt-1">{errorsBasic.season}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">الخصم</label>
                            <div className="flex items-center gap-4 mb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Switch
                                        checked={basicInfo.discount_enabled}
                                        onChange={(e) => handleBasicChange('discount_enabled', e.target.checked)}
                                        color="success"
                                    />
                                    <span className="text-sm">تفعيل الخصم</span>
                                </label>
                            </div>
                            <input
                                type="number"
                                value={basicInfo.discount}
                                onChange={(e) => handleBasicChange('discount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                min="0"
                                max="100"
                                step="0.01"
                                className={fieldClass(errorsBasic.discount, !basicInfo.discount_enabled)}
                                placeholder="نسبة الخصم %"
                                disabled={!basicInfo.discount_enabled}
                            />
                            {errorsBasic.discount && <p className="text-red-500 text-sm mt-1">{errorsBasic.discount}</p>}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الصور *</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageAdd}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green"
                            multiple
                        />
                        {errorsBasic.images && <p className="text-red-500 text-sm mt-1">{errorsBasic.images}</p>}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {(basicInfo.images || []).map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image && (image instanceof File ? URL.createObjectURL(image) : image)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <button
                                        onClick={() => handleImageRemove(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العلامات *</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button key={cat} type="button" onClick={() => handleTagToggle(cat)} className={`px-4 py-2 rounded-full text-body-bold-14 cursor-pointer min-w-[100px] transition-colors ${basicInfo.tags.includes(cat) ? "bg-green text-white border border-green" : "border-2 border-green text-green hover:bg-green-50"}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {errorsBasic.tags && <p className="text-red-500 text-sm mt-1">{errorsBasic.tags}</p>}
                    </div>
                </div>

                <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button onClick={onClose} disabled={isLoading} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition cursor-pointer disabled:opacity-50">إلغاء</button>
                    <button onClick={handleBasicNext} disabled={isLoading} className="px-6 py-3 bg-green text-white rounded-xl hover:bg-green-dark transition cursor-pointer disabled:opacity-50 flex items-center gap-2">التالي <ArrowLeft size={16} /></button>
                </div>
            </div>
        </div>
    );

    const TimelineStep = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 font-bold text-gray-700 hover:text-gray-900 cursor-pointer">✕</button>

                <h2 className="text-right text-h1-bold-32 text-green mb-6">
                    {mode === "reactivate" ? "إعادة تفعيل رحلة - مخطط الأيام" : "مخطط الأيام"}
                </h2>

                <div className="space-y-6">
                    {timelines.map((timeline, dayIndex) => (
                        <div key={dayIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button onClick={() => toggleDayAccordion(dayIndex)} className="w-full p-4 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition">
                                <span className="text-lg font-semibold">اليوم {timeline.day ?? dayIndex + 1}</span>
                                {expandedDays[dayIndex] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {expandedDays[dayIndex] && (
                                <div className="p-4 space-y-4">
                                    {(timeline.sections || []).map((section, sectionIndex) => (
                                        <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">الوقت *</label>
                                                    <input type="time" value={section.time} onChange={(e) => handleSectionFieldChange(dayIndex, sectionIndex, 'time', e.target.value)} className={fieldClass(errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-time`])} />
                                                    {errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-time`] && <p className="text-red-500 text-sm mt-1">{errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-time`]}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
                                                    <input type="text" value={section.title} onChange={(e) => handleSectionFieldChange(dayIndex, sectionIndex, 'title', e.target.value)} className={fieldClass(errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-title`])} placeholder="عنوان النشاط" />
                                                    {errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-title`] && <p className="text-red-500 text-sm mt-1">{errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-title`]}</p>}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف *</label>
                                                {(section.description || []).map((descLine, descIndex) => (
                                                    <div key={descIndex} className="flex gap-2 mb-2">
                                                        <input type="text" value={descLine} onChange={(e) => handleDescriptionChange(dayIndex, sectionIndex, descIndex, e.target.value)} className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green" placeholder="سطر وصف" />
                                                        {section.description.length > 1 && (
                                                            <button onClick={() => handleDescriptionLineRemove(dayIndex, sectionIndex, descIndex)} className="px-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"><Trash2 size={16} /></button>
                                                        )}
                                                    </div>
                                                ))}
                                                {errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-description`] && <p className="text-red-500 text-sm mt-1">{errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-description`]}</p>}
                                                <button onClick={() => handleDescriptionLineAdd(dayIndex, sectionIndex)} className="mt-2 px-4 py-2 bg-green text-white rounded-xl hover:bg-green-dark transition flex items-center gap-2"><Plus size={16} /> إضافة سطر وصف</button>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع *</label>
                                                <MapSearchPicker
                                                    onSelect={({ lat, lon }) => {
                                                        handleSectionFieldChange(dayIndex, sectionIndex, 'latitude', lat);
                                                        handleSectionFieldChange(dayIndex, sectionIndex, 'longitude', lon);
                                                    }}
                                                    initialPosition={section.latitude && section.longitude ? [section.latitude, section.longitude] : undefined}
                                                />
                                                {errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-location`] && <p className="text-red-500 text-sm mt-1">{errorsTimeline[`timeline-${dayIndex}-${sectionIndex}-location`]}</p>}
                                            </div>

                                            {timeline.sections.length > 1 && (
                                                <button onClick={() => handleTimelineSectionRemove(dayIndex, sectionIndex)} className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center gap-2"><Trash2 size={16} /> حذف هذا النشاط</button>
                                            )}
                                        </div>
                                    ))}

                                    <button onClick={() => handleTimelineSectionAdd(dayIndex)} className="px-4 py-2 bg-green text-white rounded-xl hover:bg-green-dark transition flex items-center gap-2"><Plus size={16} /> إضافة نشاط جديد</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button onClick={handleTimelineBack} disabled={isLoading} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition cursor-pointer disabled:opacity-50">رجوع</button>

                    <button onClick={handleTimelineNextOrSave} disabled={isLoading} className="px-6 py-3 bg-green text-white rounded-xl hover:bg-green-dark transition cursor-pointer disabled:opacity-50 flex items-center gap-2">
                        {mode === "reactivate" ? "التالي" : "حفظ الرحلة"}
                        <ArrowLeft size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    // Step 3: Improvements (only for reactivate)
    const ImprovementsStep = (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative">
                <button onClick={onClose} className="absolute top-6 left-6 w-10 h-10 font-bold text-gray-700 hover:text-gray-900 cursor-pointer">✕</button>

                <h2 className="text-right text-h1-bold-32 text-green mb-6">ملاحظات / تحسينات (نص)</h2>

                <div className="space-y-6">
                    <p className="text-sm text-gray-600">أدخل ملاحظات أو تحسينات على الرحلة، كل سطر سيصبح عنصرًا في المصفوفة improvements[].</p>
                    <textarea
                        value={improvementsText}
                        onChange={(e) => handleImprovementsTextChange(e.target.value)}
                        rows={8}
                        className={`${baseInput} resize-none`}
                        placeholder="سطر 1&#10;سطر 2&#10;..."
                    />
                </div>

                <div className="flex justify-between gap-4 pt-6 mt-6 border-t border-gray-200">
                    <button onClick={handleImprovementsBack} disabled={isLoading} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition cursor-pointer disabled:opacity-50">رجوع</button>

                    <button onClick={handleFinalSave} disabled={isLoading} className="px-6 py-3 bg-green text-white rounded-xl hover:bg-green-dark transition cursor-pointer disabled:opacity-50 flex items-center gap-2">
                        {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : "حفظ الرحلة"}
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    // Render the correct step
    if (step === 1) return BasicStep;
    if (step === 2) return TimelineStep;
    if (step === 3) return ImprovementsStep;

    return null;
};

export default TripDialog;