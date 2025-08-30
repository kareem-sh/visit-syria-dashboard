// components/dialog/TripEditDialog.jsx
import React, { useState, useEffect, useRef } from "react";
import { X as XIcon, Paperclip } from "lucide-react";
import { toast } from "react-toastify";
import Bin from "@/assets/icons/event/bin.svg";
import pen from "@/assets/icons/event/pen.svg";

export default function TripEditDialog({
                                           open,
                                           onClose,
                                           initialData = {},
                                           onSubmit,
                                           isLoading = false,
                                       }) {
    const DESCRIPTION_MAX_LENGTH = 1000;
    const DESCRIPTION_MIN_LENGTH = 10;
    const MAX_TOTAL_IMAGES = 5; // Maximum total images (existing + new)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        images: [], // New images (files)
        old_images: [], // Existing images (URLs)
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            if (initialData) {
                // Handle both single image and multiple images
                const old_images = Array.isArray(initialData.images)
                    ? initialData.images.filter(img => typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')))
                    : (initialData.image && typeof initialData.image === 'string' && (initialData.image.startsWith('http') || initialData.image.startsWith('/')))
                        ? [initialData.image]
                        : [];

                setFormData({
                    name: initialData.name || "",
                    description: initialData.description || "",
                    images: [],
                    old_images: old_images, // Use old_images
                });

                // Set image previews from old images
                setImagePreviews(old_images);
            } else {
                setFormData({
                    name: "",
                    description: "",
                    images: [],
                    old_images: [], // Use old_images
                });
                setImagePreviews([]);
                setErrors({});
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        }
    }, [open, initialData]);

    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition bg-white";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500";
    const fieldClass = (error) => `${baseInput} ${error ? errorInput : validInput}`;

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Calculate available slots for new images
        const availableSlots = MAX_TOTAL_IMAGES - formData.old_images.length;
        if (availableSlots <= 0) {
            toast.error(`لا يمكن إضافة صور جديدة، الحد الأقصى ${MAX_TOTAL_IMAGES} صور`);
            return;
        }

        // Take only the number of files that fit in available slots
        const filesToProcess = files.slice(0, availableSlots);

        const validImages = filesToProcess.filter(file =>
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
        );

        if (validImages.length !== filesToProcess.length) {
            toast.error("بعض الصور غير صالحة أو حجمها أكبر من 5MB");
        }

        if (validImages.length > 0) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...validImages]
            }));

            // Create previews for new images
            const newPreviews = validImages.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);

            setErrors(prev => ({ ...prev, images: null }));
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (index, isOldImage = false) => {
        if (isOldImage) {
            // Remove old image
            setFormData(prev => ({
                ...prev,
                old_images: prev.old_images.filter((_, i) => i !== index)
            }));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        } else {
            // Remove new image
            const newIndex = index - formData.old_images.length;
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== newIndex)
            }));

            // Revoke the object URL to avoid memory leaks
            URL.revokeObjectURL(imagePreviews[index]);
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > DESCRIPTION_MAX_LENGTH) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "اسم الرحلة مطلوب";
        if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (formData.description.trim().length < DESCRIPTION_MIN_LENGTH) {
            newErrors.description = `يجب أن يحتوي الوصف على ${DESCRIPTION_MIN_LENGTH} حروف على الأقل`;
        }
        if (formData.old_images.length === 0 && formData.images.length === 0) {
            newErrors.images = "صورة الرحلة مطلوبة على الأقل";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("يرجى ملء جميع الحقول الإلزامية");
            return;
        }

        // Prepare the data to send back to parent
        const submitData = {
            name: formData.name,
            description: formData.description,
            images: formData.images,
            old_images: formData.old_images // Use old_images
        };

        onSubmit(submitData);
    };

    // Clean up object URLs when component unmounts or dialog closes
    useEffect(() => {
        return () => {
            imagePreviews.forEach((preview, index) => {
                if (index >= formData.old_images.length) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [imagePreviews, formData.old_images.length]);

    const totalImages = formData.old_images.length + formData.images.length;
    const canAddMoreImages = totalImages < MAX_TOTAL_IMAGES;

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]" onClick={onClose}>
            <div className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-8 pt-6 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()} dir="rtl">
                <button className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 cursor-pointer z-10" onClick={onClose} type="button">
                    <XIcon size={24} />
                </button>

                <h2 className="text-h1-bold-32 text-green mt-2 mb-6 text-right">
                    تعديل الرحلة
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-body-regular-caption-12">اسم الرحلة*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={fieldClass(errors.name)}
                                placeholder="اسم الرحلة"
                                disabled={isLoading}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="relative">
                            <label className="text-body-regular-caption-12">الوصف*</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`${fieldClass(errors.description)} resize-none`}
                                placeholder="وصف الرحلة"
                                disabled={isLoading}
                            />
                            <p className="absolute bottom-2 left-3 text-xs text-gray-400">
                                {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
                            </p>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            {formData.description.length > 0 && formData.description.length < DESCRIPTION_MIN_LENGTH && (
                                <p className="text-red-500 text-xs mt-1">يجب أن يحتوي على {DESCRIPTION_MIN_LENGTH} حروف على الأقل</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-body-regular-caption-12">صور الرحلة*</label>
                        <div className="relative">
                            <div className={`${fieldClass(errors.images)} flex items-center justify-between cursor-pointer ${isLoading || !canAddMoreImages ? 'opacity-50' : ''}`}>
                                <span className="text-sm text-gray-500">
                                    {formData.images.length > 0 ? `تم اختيار ${formData.images.length} صورة جديدة` :
                                        formData.old_images.length > 0 ? `${formData.old_images.length} صورة حالية` : "اختر صور..."}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{totalImages}/{MAX_TOTAL_IMAGES}</span>
                                    <Paperclip size={18} className="text-gray-500" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    disabled={isLoading || !canAddMoreImages}
                                />
                            </div>
                        </div>
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                        {!canAddMoreImages && (
                            <p className="text-xs text-gray-500 mt-1">الحد الأقصى للصور هو {MAX_TOTAL_IMAGES}</p>
                        )}
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-32 object-cover rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index, index < formData.old_images.length)}
                                            disabled={isLoading}
                                            className="p-2 cursor-pointer transition-colors"
                                        >
                                            <img src={Bin} alt="حذف الصورة" className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {index < formData.old_images.length && (
                                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            صورة حالية
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-white text-green border-2 border-green py-3 rounded-xl hover:shadow-lg cursor-pointer transition flex items-center justify-center gap-2 font-semibold ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green"></div>
                                    جاري المعالجة...
                                </>
                            ) : (
                                <>
                                    <img src={pen} alt="تعديل" className="w-5 h-5" />
                                    تعديل الرحلة
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}