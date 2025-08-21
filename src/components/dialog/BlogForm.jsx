import React, { useState, useEffect, useRef } from "react";
import { X as XIcon, Trash2, Paperclip, Pencil } from "lucide-react";
import { toast } from "react-toastify";
import Bin from "@/assets/icons/event/bin.svg";

export default function BlogForm({
                                     open,
                                     onClose,
                                     mode = "create",
                                     initialData = {},
                                     onSubmit,
                                 }) {
    const isEditMode = mode === "edit";
    const DESCRIPTION_MAX_LENGTH = 1000;
    const MAX_CATEGORIES = 5;

    const categories = ["أثرية", "طبيعية", "طعام", "دينية", "تاريخية", "ثقافية", "عادات و تقاليد"];

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
        categories: [],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (open) {
            if (isEditMode && initialData) {
                setFormData({
                    title: initialData.title || "",
                    description: initialData.description || initialData.content || "",
                    image: initialData.image || null,
                    categories: initialData.categories || [initialData.category] || [],
                });
                setImagePreview(initialData.image || "https://images.pexels.com/photos/163016/water-wheel-mill-water-wheel-mill-wheel-163016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
            } else {
                setFormData({ title: "", description: "", image: null, categories: [] });
                setImagePreview(null);
                setErrors({});
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
        }
    }, [open, mode, initialData, isEditMode]);

    const baseInput = "p-3 border rounded-xl focus:outline-none w-full transition bg-white";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500";
    const fieldClass = (error) => `${baseInput} ${error ? errorInput : validInput}`;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error("يرجى اختيار صورة صحيحة");
                return;
            }
            setFormData(prev => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, image: null }));
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCategoryToggle = (category) => {
        setFormData(prev => {
            const newCategories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];

            if (newCategories.length > MAX_CATEGORIES) {
                toast.warn(`لا يمكن اختيار أكثر من ${MAX_CATEGORIES} فئات`);
                return prev;
            }

            return { ...prev, categories: newCategories };
        });
        if (errors.categories) setErrors(prev => ({ ...prev, categories: null }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > DESCRIPTION_MAX_LENGTH) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "عنوان المقالة مطلوب";
        if (!formData.description.trim()) newErrors.description = "الوصف مطلوب";
        if (!formData.image && !imagePreview) newErrors.image = "صورة المقالة مطلوبة";
        if (formData.categories.length === 0) newErrors.categories = "يجب اختيار فئة واحدة على الأقل";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("يرجى ملء جميع الحقول الإلزامية");
            return;
        }
        onSubmit(formData);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]" onClick={onClose}>
            <div className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-8 pt-6 relative overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()} dir="rtl">
                <button className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 cursor-pointer z-10" onClick={onClose} type="button">
                    <XIcon size={24} />
                </button>

                <h2 className="text-h1-bold-32 text-green mt-2 mb-6 text-right">
                    {isEditMode ? "تعديل مقالة" : "إضافة مقالة"}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-body-regular-caption-12">عنوان المقالة*</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={fieldClass(errors.title)}
                                placeholder="عنوان المقالة"
                            />
                        </div>
                        <div className="relative">
                            <label className="text-body-regular-caption-12">الوصف*</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`${fieldClass(errors.description)} resize-none`}
                                placeholder="الوصف"
                            />
                            <p className="absolute bottom-2 left-3 text-xs text-gray-400">
                                {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <label className={`${fieldClass(errors.image)} flex items-center justify-between cursor-pointer`}>
                <span className="text-sm text-gray-500">
                  {imagePreview ? (typeof formData.image === 'object' ? formData.image.name : 'تم رفع الصورة') : "Images*"}
                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">1/1</span>
                                    <Paperclip size={18} className="text-gray-500" />
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                />
                            </label>
                        </div>
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                    {imagePreview && (
                        <div className="mt-4 relative group w-full">
                            <img src={imagePreview} alt="Blog Preview" className="w-full h-48 object-cover rounded-xl" />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <button type="button" onClick={handleRemoveImage} >
                                    <img src={Bin} alt={"حذف الصورة"} className="w-11 h-11 cursor-pointer" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-3">الفئة</h3>
                        <div className="flex flex-wrap gap-2 justify-between">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleCategoryToggle(category)}
                                    className={`px-4 py-2 rounded-full text-body-bold-14 cursor-pointer min-w-[100px] transition-colors ${
                                        formData.categories.includes(category)
                                            ? "bg-green text-white border border-green"
                                            : " text-green hover:shadow-md border-2 "
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {errors.categories && <p className="text-red-500 text-xs mt-1">{errors.categories}</p>}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-green text-white py-3 rounded-xl hover:shadow-lg cursor-pointer transition flex items-center justify-center gap-2 font-semibold"
                        >
                            {isEditMode ? (
                                <>
                                    <Pencil size={18} />
                                    تعديل
                                </>
                            ) : (
                                "إضافة +"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}