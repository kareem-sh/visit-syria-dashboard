import React, { useState, useEffect, useRef } from "react";

// Import icons (keep your existing paths)
import Banned from "@/assets/icons/table/Banned.svg";
import Warning from "@/assets/icons/table/Warning.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";

// Helper to normalize the "Warned" status for consistent logic
const normalizeStatus = (status) => {
    if (status === "تم الانذار") {
        return "تم الإنذار";
    }
    return status;
};

export default function CompanyStatusDialog({
                                                isOpen,
                                                onClose,
                                                currentStatus: initialStatus,
                                                onConfirm,
                                                // optional: allow parent to pass custom next options if desired
                                                dropdownOptions,
                                            }) {
    const currentStatus = normalizeStatus(initialStatus);

    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [reason, setReason] = useState("");
    const [inputError, setInputError] = useState("");
    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    const statusDetails = {
        "فعالة": { text: "فعالة", icon: doneIcon, bg: "bg-green-100/60", textColor: "text-green" },
        "تم الإنذار": { text: "تم الإنذار", icon: Warning, bg: "bg-gold-500/10", textColor: "text-gold" },
        "قيد الحذف": { text: "قيد الحذف", icon: canceledIcon, bg: "bg-red-50", textColor: "text-red-600" },
    };

    const getNextOptions = () => {
        if (Array.isArray(dropdownOptions) && dropdownOptions.length > 0) {
            // normalize and filter out current status
            return dropdownOptions.map(normalizeStatus).filter((o) => o !== currentStatus);
        }

        switch (currentStatus) {
            case "فعالة":
                return ["تم الإنذار"];
            case "تم الإنذار":
                return ["فعالة", "قيد الحذف"];
            case "قيد الحذف":
                return ["فعالة"];
            default:
                return [];
        }
    };

    const nextOptions = getNextOptions();

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setInputError("");
            // default select the first next option if available, otherwise keep current
            if (nextOptions.length > 0) {
                setSelectedStatus(nextOptions[0]);
            } else {
                setSelectedStatus(currentStatus);
            }
            setOpen(false);
        }
    }, [isOpen, currentStatus, JSON.stringify(nextOptions)]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Keyboard handling for accessibility
    useEffect(() => {
        function onKey(e) {
            if (!open) return;
            if (e.key === "Escape") setOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (!isOpen) return null;

    const showReason = selectedStatus !== "فعالة" && selectedStatus !== currentStatus;
    const isConfirmEnabled = selectedStatus !== currentStatus && (showReason ? !!reason.trim() : true);

    const handleConfirm = () => {
        if (showReason && !reason.trim()) {
            setInputError("هذا الحقل مطلوب");
            return;
        }
        if (isConfirmEnabled) {
            onConfirm(selectedStatus, reason.trim());
            onClose();
        }
    };

    const dialogContent = () => {
        const base = {
            title: "تغيير حالة الشركة",
            reasonLabel: "يرجى ذكر السبب*",
            reasonPlaceholder: "أسباب تغيير الحالة...",
        };

        switch (selectedStatus) {
            case "قيد الحذف":
                return {
                    ...base,
                    message: "هل أنت متأكد من تعطيل الشركة؟",
                    buttonText: "تأكيد التعطيل",
                    buttonColor: "bg-red-500",
                    focusColor: "focus:ring-red-500 focus:border-red-500",
                };
            case "فعالة":
                return {
                    ...base,
                    message: "هل أنت متأكد من تفعيل الشركة؟",
                    buttonText: "تأكيد التفعيل",
                    buttonColor: "bg-green",
                    focusColor: "focus:ring-green focus:border-green",
                };
            case "تم الإنذار":
                return {
                    ...base,
                    message: "هل أنت متأكد من توجيه إنذار للشركة؟",
                    buttonText: "تأكيد الإنذار",
                    buttonColor: "bg-gold",
                    focusColor: "focus:ring-gold focus:border-gold",
                };
            default:
                return {
                    ...base,
                    message: "يرجى تحديد حالة جديدة",
                    buttonText: "تأكيد",
                    buttonColor: "bg-gray-400",
                    focusColor: "focus:ring-gray-400 focus:border-gray-400",
                };
        }
    };

    const { title, message, buttonText, buttonColor, reasonLabel, reasonPlaceholder, focusColor } =
        dialogContent();

    const isStatusChanged = selectedStatus !== currentStatus;
    const selectedStatusStyles = statusDetails[selectedStatus] || { bg: "bg-gray-100", textColor: "text-gray-800", icon: null };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 font-inter">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 relative" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="company-status-title">
                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 text-2xl cursor-pointer"
                    aria-label="إغلاق"
                >
                    ✕
                </button>

                <h2 id="company-status-title" className="text-right text-[28px] font-bold text-green mb-4">{title}</h2>

                <div className="flex items-center gap-2 mb-6 text-lg">
                    <span className="text-gray-700 font-semibold">تغيير من:</span>

                    <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-base ${statusDetails[currentStatus]?.bg} ${statusDetails[currentStatus]?.textColor}`}
                    >
                        {statusDetails[currentStatus]?.icon && (
                            <img src={statusDetails[currentStatus].icon} alt={`${statusDetails[currentStatus].text} icon`} className="w-5 h-5 ml-1" />
                        )}
                        {statusDetails[currentStatus]?.text}
                    </div>

                    <span className="mx-2 text-gray-700 font-semibold" >إلى:</span>

                    {/* Custom dropdown */}
                    {nextOptions.length > 0 ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setOpen((s) => !s)}
                                className={`flex items-center gap-2 pl-3 pr-3 py-1 rounded-full font-semibold text-base transition-colors ${selectedStatusStyles.bg} ${selectedStatusStyles.textColor} focus:outline-none ${focusColor}`}
                                aria-haspopup="listbox"
                                aria-expanded={open}
                            >
                                {selectedStatusStyles.icon && (
                                    <img src={selectedStatusStyles.icon} alt="" className="w-5 h-5" />
                                )}
                                <span>{selectedStatusStyles.text}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none" className="stroke-current">
                                    <path d="M5 7.5L10 12.5L15 7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>

                            {open && (
                                <ul
                                    role="listbox"
                                    aria-activedescendant={selectedStatus}
                                    tabIndex={-1}
                                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-20"
                                >
                                    {nextOptions.map((option) => {
                                        const s = statusDetails[option] || { text: option, icon: null, bg: "bg-white", textColor: "text-gray-800" };
                                        const isSelected = option === selectedStatus;
                                        return (
                                            <li
                                                key={option}
                                                id={option}
                                                role="option"
                                                aria-selected={isSelected}
                                                onClick={() => {
                                                    setSelectedStatus(option);
                                                    setOpen(false);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        setSelectedStatus(option);
                                                        setOpen(false);
                                                    }
                                                }}
                                                className={`flex items-center gap-2 px-4 py-3 cursor-pointer text-right ${isSelected ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"} ${s.textColor}`}
                                            >
                                                {s.icon && <img src={s.icon} alt="" className="w-5 h-5 ml-1" />}
                                                <span className="flex-1">{s.text}</span>
                                                {/* optional small badge / hint */}
                                                {isSelected && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M20 6L9 17l-5-5"></path>
                                                    </svg>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-base ${statusDetails[nextOptions[0]]?.bg} ${statusDetails[nextOptions[0]]?.textColor}`}
                        >
                            <span className="text-gray-500">لا توجد تغييرات متاحة</span>
                        </div>
                    )}
                </div>

                {isStatusChanged && (
                    <p className="text-right text-[20px] font-semibold text-gray-800 mb-4">{message}</p>
                )}

                {showReason && (
                    <div className="mt-4">
                        <label className="block text-right text-sm font-medium text-gray-600 mb-1">{reasonLabel}</label>
                        <div className="relative">
              <textarea
                  value={reason}
                  onChange={(e) => {
                      setReason(e.target.value);
                      if (inputError) setInputError("");
                  }}
                  rows={4}
                  maxLength={1000}
                  className={`w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-right text-lg ${focusColor}`}
                  placeholder={reasonPlaceholder}
              />
                            <span className="absolute bottom-4 left-4 text-xs text-gray-400">{reason.length}/1000</span>
                        </div>
                        {inputError && <p className="text-red-500 text-sm mt-2 text-right">{inputError}</p>}
                    </div>
                )}

                <div className="flex flex-col gap-4 pt-6">
                    <button
                        onClick={handleConfirm}
                        disabled={!isConfirmEnabled}
                        className={`w-full py-4 rounded-full text-white font-semibold transition-colors flex items-center justify-center text-lg ${isConfirmEnabled ? `${buttonColor} cursor-pointer`  : `${buttonColor} cursor-not-allowed`} `}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
