import React, { useState, useEffect, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import "@/components/dialog/PlaceForm.css";
import { X, Paperclip, Trash2, Upload, Eye } from "lucide-react";
import { toast } from "react-toastify";
import MapSearchPicker from "@/components/common/MapSearchPicker";
import Map from "@/components/common/Map";
import DocumentViewer from "@/components/common/DocumentViewer";
import CompanyProfile from "@/assets/images/Company Profile.svg";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog";
import Decline from "@/assets/icons/common/decline.svg";
import Approve from "@/assets/icons/common/approve.svg";

export default function CompanyDialog({
                                          open,
                                          onClose,
                                          mode = "create", // 'create' | 'view'
                                          initialData = {},
                                          onAdd,
                                          onAccept,
                                          onDecline,
                                      }) {
    const isViewMode = mode === "view";

    const [formData, setFormData] = useState({
        name_of_company: "", name_of_owner: "", license_number: "",
        founding_date: "", email: "", phone: "", country_code: "+963",
        documents: [], description: "", latitude: null, longitude: null, image: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
    const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
    const [logoViewerOpen, setLogoViewerOpen] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    // Create a stable initial data reference
    const initialDataRef = React.useRef(initialData);

    useEffect(() => {
        initialDataRef.current = initialData;
    }, [initialData]);

    const resetForm = useCallback(() => {
        setFormData({
            name_of_company: "", name_of_owner: "", license_number: "",
            founding_date: "", email: "", phone: "", country_code: "+963",
            documents: [], description: "", latitude: null, longitude: null, image: null,
        });
        setLogoPreview(null);
        setErrors({});
        setShowAcceptDialog(false);
        setShowRejectDialog(false);
    }, []);

    useEffect(() => {
        if (open) {
            const data = initialDataRef.current || {};
            setFormData({
                name_of_company: data.name_of_company || "",
                name_of_owner: data.name_of_owner || "",
                license_number: data.license_number || "",
                founding_date: data.founding_date || "",
                email: data.email || "",
                phone: data.phone || "",
                country_code: data.country_code || "+963",
                documents: data.documents || [],
                description: data.description || "",
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                image: data.image || null,
            });
            setLogoPreview(data.image || null);
        } else {
            // Reset form when dialog closes to ensure it's fresh next time
            resetForm();
        }
    }, [open, resetForm]);

    // Get today's date in YYYY-MM-DD format for date input max value
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const baseInput = "p-3 bg-white border rounded-xl focus:outline-none w-full transition text-right";
    const validInput = "border-gray-300 focus:ring-2 focus:ring-green focus:border-green";
    const errorInput = "border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500";
    const fieldClass = (error) => `${baseInput} ${error ? errorInput : validInput}`;

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveLogo = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setLogoPreview(null);
        const fileInput = document.getElementById('logo-input');
        if (fileInput) fileInput.value = "";
    };

    const handleDocumentsChange = (e) => {
        const newFiles = Array.from(e.target.files);

        // Check if adding these files would exceed the 10 file limit
        if (formData.documents.length + newFiles.length > 10) {
            toast.error("يمكنك رفع عشرة ملفات كحد أقصى");
            return;
        }

        // Process files to add preview URLs for images
        const processedFiles = newFiles.map(file => {
            if (file.type.startsWith('image/')) {
                return {
                    file,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    type: 'image',
                    preview: URL.createObjectURL(file)
                };
            } else {
                return {
                    file,
                    name: file.name,
                    type: 'document'
                };
            }
        });

        setFormData(prev => ({ ...prev, documents: [...prev.documents, ...processedFiles] }));
        // Clear documents error when files are added
        if (errors.documents) {
            setErrors(prev => ({ ...prev, documents: null }));
        }
    };

    // Remove a document/image
    const removeDocument = (index) => {
        setFormData(prev => {
            const newDocs = [...prev.documents];
            // Revoke the object URL to avoid memory leaks if it's an image
            if (newDocs[index].url) {
                URL.revokeObjectURL(newDocs[index].url);
            }
            newDocs.splice(index, 1);
            return { ...prev, documents: newDocs };
        });
    };

    // This function handles all text input changes, making the form editable
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        // Clear error when field is filled
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePhoneChange = (value, data) => {
        const dialCode = data.dialCode;
        const phoneNumber = value.replace(dialCode, "");
        setFormData(prev => ({ ...prev, phone: phoneNumber, country_code: `+${dialCode}` }));
        // Clear phone error when phone is filled
        if (errors.phone) {
            setErrors(prev => ({ ...prev, phone: null }));
        }
    };

    const handleLocationSelect = ({ display_name, lat, lon }) => {
        setFormData(prev => ({ ...prev, place: display_name, latitude: lat, longitude: lon }));
        // Clear location error when location is selected
        if (errors.location) {
            setErrors(prev => ({ ...prev, location: null }));
        }
    };

    const handleAdd = () => {
        const newErrors = {};
        if (!formData.name_of_company) newErrors.name_of_company = "اسم الشركة مطلوب";
        if (!formData.name_of_owner) newErrors.name_of_owner = "اسم صاحب الشركة مطلوب";
        if (!formData.license_number) newErrors.license_number = "رقم الترخيص مطلوب";
        if (!formData.founding_date) newErrors.founding_date = "تاريخ التأسيس مطلوب";
        if (!formData.email) newErrors.email = "البريد الإلكتروني مطلوب";
        if (!formData.phone) newErrors.phone = "رقم الهاتف مطلوب";
        if (!formData.description) newErrors.description = "الوصف مطلوب";
        if (!formData.latitude || !formData.longitude) newErrors.location = "الموقع مطلوب";
        if (!formData.documents || formData.documents.length === 0) newErrors.documents = "الوثائق مطلوبة";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("يرجى ملء جميع الحقول الإلزامية");
            return;
        }
        setErrors({});
        onAdd && onAdd(formData);
        onClose();
    };

    const openDocumentViewer = (index) => {
        setSelectedDocumentIndex(index);
        setDocumentViewerOpen(true);
    };

    const openLogoViewer = () => {
        if (logoPreview) {
            setLogoViewerOpen(true);
        }
    };

    const handleAcceptClick = () => {
        setShowAcceptDialog(true);
    };

    const handleRejectClick = () => {
        setShowRejectDialog(true);
    };

    const handleConfirmAccept = () => {
        setShowAcceptDialog(false);
        onAccept && onAccept(initialData);
        onClose();
    };

    const handleConfirmReject = (reason) => {
        setShowRejectDialog(false);
        onDecline && onDecline({ ...initialData, rejectionReason: reason });
        onClose();
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]" onClick={onClose}>
                <div className="bg-[#f7f7f7] rounded-2xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()} dir="rtl">
                    <button className="absolute top-6 left-6 text-gray-500 hover:text-gray-700 cursor-pointer z-10" onClick={onClose} type="button">
                        <X size={24} />
                    </button>
                    <h2 className="text-h1-bold-32 text-green mt-2 pr-2 text-right">
                        {mode === "create" ? "إضافة شركة" : "عرض تفاصيل الشركة"}
                    </h2>
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="relative w-30 h-30 group mt-4">
                            {logoPreview ? (
                                <>
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full rounded-full object-cover border-2 border-gray-200" />
                                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                        <button
                                            type="button"
                                            onClick={openLogoViewer}
                                            className="p-2 bg-green text-white rounded-full hover:bg-green-dark"
                                            aria-label="معاينة الشعار"
                                        >
                                            <Eye size={24} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <img
                                        src={CompanyProfile}
                                        alt="Company Profile"
                                        className="w-30 h-30 text-gray-400"
                                    />
                                </div>
                            )}
                            {!isViewMode && (
                                <>
                                    <label htmlFor="logo-input" className="absolute -bottom-1 -right-1 w-9 h-9 bg-green text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-green-dark transition-all">
                                        <Upload size={20}/>
                                        <input id="logo-input" type="file" accept="image/*" onChange={handleLogoChange} className="hidden"/>
                                    </label>
                                    {logoPreview && (
                                        <button onClick={handleRemoveLogo} type="button" className="absolute -bottom-1 -left-1 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all">
                                            <Trash2 size={20}/>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة*</label>
                            <input type="text" name="name_of_company" value={formData.name_of_company} onChange={handleChange} disabled={isViewMode} className={fieldClass(errors.name_of_company)} placeholder="اسم الشركة"/>
                            {errors.name_of_company && <p className="text-red-500 text-xs mt-1">{errors.name_of_company}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم صاحب الشركة*</label>
                            <input type="text" name="name_of_owner" value={formData.name_of_owner} onChange={handleChange} disabled={isViewMode} className={fieldClass(errors.name_of_owner)} placeholder="اسم صاحب الشركة"/>
                            {errors.name_of_owner && <p className="text-red-500 text-xs mt-1">{errors.name_of_owner}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الترخيص*</label>
                            <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} disabled={isViewMode} className={fieldClass(errors.license_number)} placeholder="رقم الترخيص"/>
                            {errors.license_number && <p className="text-red-500 text-xs mt-1">{errors.license_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ تأسيس الشركة*</label>
                            <input
                                type="date"
                                name="founding_date"
                                value={formData.founding_date}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className={fieldClass(errors.founding_date)}
                                max={getTodayDate()} // Restrict to today and past dates
                            />
                            {errors.founding_date && <p className="text-red-500 text-xs mt-1">{errors.founding_date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني*</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isViewMode} className={fieldClass(errors.email)} placeholder="example@email.com"/>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف*</label>
                            <div className="placeform-phone-wrapper">
                                <PhoneInput country={"sy"} value={`${formData.country_code}${formData.phone}`} onChange={handlePhoneChange} enableSearch disabled={isViewMode} containerClass={`react-tel-input ${errors.phone ? "phone-error" : ""} show-dialcode`} inputClass="form-control" buttonClass="flag-dropdown" />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Description and Documents are now side-by-side */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف*</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} disabled={isViewMode} rows={4} className={`${fieldClass(errors.description)} resize-none`} placeholder="وصف الشركة ونشاطها"/>
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الوثائق*</label>
                            <div className="relative">
                                <label role="filepicker" className={`${fieldClass(errors.documents)} flex items-center justify-between ${!isViewMode ? 'cursor-pointer' : 'cursor-default bg-gray-100'}`}>
                  <span className="text-sm text-gray-700">
                    {formData.documents.length > 0 ? `${formData.documents.length} ملفات مختارة` : "اختر المستندات والصور"}
                  </span>
                                    <Paperclip size={18} className="text-gray-500"/>
                                    {!isViewMode && (
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleDocumentsChange}
                                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                        />
                                    )}
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                يمكنك رفع عشرة ملفات كحد أقصى (مستندات أو صور)
                            </p>
                            {errors.documents && <p className="text-red-500 text-xs mt-1">{errors.documents}</p>}

                            {/* Document and image previews */}
                            {formData.documents.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {formData.documents.map((doc, index) => (
                                            <div
                                                key={index}
                                                className="relative w-[90px] h-[90px] border rounded-xl overflow-hidden group"
                                            >
                                                {doc.type === 'image' ? (
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.parentNode.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-2">
                                                        <Paperclip size={24} className="text-gray-400 mb-1" />
                                                        <span className="text-xs text-gray-600 text-center truncate w-full">
                              {doc.name}
                            </span>
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                                                    <button
                                                        type="button"
                                                        onClick={() => openDocumentViewer(index)}
                                                        className="p-2 bg-green text-white rounded-full hover:bg-green-dark"
                                                        aria-label="معاينة الملف"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    {!isViewMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDocument(index)}
                                                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
                                                            aria-label="حذف الملف"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">الموقع*</label>
                            {isViewMode ? (
                                <Map position={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : undefined} height={250} width="100%"/>
                            ) : (
                                <MapSearchPicker
                                    initialPosition={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : undefined}
                                    initialPlace={formData.place}
                                    onSelect={handleLocationSelect}
                                    disabled={isViewMode}
                                />
                            )}
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                        </div>

                        <div className="md:col-span-2 mt-4">
                            {mode === "create" && (
                                <button onClick={handleAdd} className="w-full bg-green text-white py-3 rounded-xl hover:shadow-md cursor-pointer transition flex items-center justify-center gap-2 font-semibold">
                                    إضافة +
                                </button>
                            )}
                            {mode === "view" && (
                                <div className="flex gap-3">
                                    <button
                                        className="flex items-center ص w-full justify-center shadow-md shadow-grey-400 gap-2 rounded-2xl cursor-pointer px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-green"
                                        onClick={handleAcceptClick}
                                    >

                                        قبول
                                        <img src={Approve} alt="Approve" className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="flex items-center w-full justify-center gap-2 shadow-md shadow-grey-400  rounded-2xl cursor-pointer px-5 py-3 text-white font-bold text-base transition-opacity hover:opacity-90 bg-red-500"
                                        onClick={handleRejectClick}
                                    >

                                        رفض
                                        <img src={Decline} alt="Decline" className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Dialogs */}
            <ConfirmationDialog
                isOpen={showAcceptDialog}
                onClose={() => setShowAcceptDialog(false)}
                onConfirm={handleConfirmAccept}
                title="قبول الطلب"
                message="هل أنت متأكد من قبول الطلب؟"
                confirmText="تأكيد"
                cancelText="تراجع"
                confirmColor="green"
                requestDate={initialData.date} // Pass the request date here
            />

            <ConfirmationDialog
                isOpen={showRejectDialog}
                onClose={() => setShowRejectDialog(false)}
                onConfirm={handleConfirmReject}
                title="رفض الطلب"
                message="هل أنت متأكد من رفض الطلب؟"
                confirmText="تأكيد"
                cancelText="تراجع"
                confirmColor="red"
                showTextInput={true}
                textInputLabel="أسباب الرفض"
                textInputPlaceholder="يرجى كتابة أسباب الرفض"
                requiredTextInput={true}
                requestDate={initialData.date} // Pass the request date here
            />

            {documentViewerOpen && (
                <DocumentViewer
                    documents={formData.documents}
                    initialIndex={selectedDocumentIndex}
                    onClose={() => setDocumentViewerOpen(false)}
                />
            )}

            {logoViewerOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000]">
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 cursor-pointer z-10"
                        onClick={() => setLogoViewerOpen(false)}
                        type="button"
                    >
                        <X size={32} />
                    </button>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="max-w-4xl max-h-full w-full h-full flex items-center justify-center p-4">
                            <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}