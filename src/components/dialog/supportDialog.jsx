import React, { useState, useEffect } from "react";
import { X as XIcon, Pencil } from "lucide-react";
import { toast } from "react-toastify";

export default function SupportForm({
    open,
    onClose,
    mode = "create",
    initialData = {},
    type = "policy", 
    onSubmit,
}) {
    const isEditMode = mode === "edit";
    const DESCRIPTION_MAX_LENGTH = 1000;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "all",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            if (isEditMode && initialData) {
                setFormData({
                    title: initialData.title || "",
                    description: initialData.description || initialData.content || "",
                    category: initialData.category || "all",
                });
            } else {
                setFormData({ title: "", description: "", category: "all" });
                setErrors({});
            }
        }
    }, [open, mode, initialData, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > DESCRIPTION_MAX_LENGTH) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "العنوان مطلوب";
        if (!formData.description.trim()) newErrors.description = "المحتوى مطلوب";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("يرجى ملء جميع الحقول الإلزامية");
            return;
        }

        const payload = isEditMode
        ? { ...formData, id: initialData.id }
        : formData;

        onSubmit(payload);
        onClose();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]"
            onClick={onClose}
        >
            <div
                className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-8 pt-6 relative overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                <button
                    className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
                    onClick={onClose}
                    type="button"
                >
                    <XIcon size={24} />
                </button>

                <h2 className="text-h1-bold-32 text-green mt-2 mb-6 text-right">
                    {isEditMode
                        ? "تعديل"
                        : type === "policy"
                        ? "إضافة شرط استخدام"
                        : "إضافة سؤال"}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-body-regular-caption-12">العنوان*</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="p-3 border rounded-xl w-full border-gray-300 focus:ring-2 focus:ring-green"
                                placeholder="عنوان المحتوى"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="text-body-regular-caption-12">الفئة*</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="p-3 border rounded-xl w-full border-gray-300 focus:ring-2 focus:ring-green"
                            >
                                <option value="all">الكل</option>
                                <option value="user">تطبيق المستخدمين</option>
                                <option value="tourism">لوحة شركات السياحة</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-body-regular-caption-12">المحتوى*</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className="p-3 border rounded-xl w-full border-gray-300 focus:ring-2 focus:ring-green resize-none"
                            placeholder="المحتوى"
                        />
                        <p className="text-xs text-gray-400 text-right">
                            {formData.description.length}/{DESCRIPTION_MAX_LENGTH}
                        </p>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
