import React, { useState } from "react";

export default function ConfirmationDialog({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               title = "تأكيد",
                                               message = "هل أنت متأكد من الإجراء؟",
                                               confirmText = "تأكيد",
                                               cancelText = "إلغاء",
                                               confirmColor = "green",
                                               showTextInput = false,
                                               textInputLabel = "السبب",
                                               textInputPlaceholder = "يرجى كتابة السبب",
                                               requiredTextInput = false,
                                               requestDate = null
                                           }) {
    const [inputValue, setInputValue] = useState("");
    const [inputError, setInputError] = useState("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (showTextInput && requiredTextInput && !inputValue.trim()) {
            setInputError("هذا الحقل مطلوب");
            return;
        }

        onConfirm(inputValue.trim());
        setInputValue("");
        setInputError("");
    };

    const handleClose = () => {
        setInputValue("");
        setInputError("");
        onClose();
    };

    // Color classes mapping
    const colorClasses = {
        green: "bg-green hover:bg-green-dark text-green",
        red: "bg-red-600 hover:bg-red-700 text-red-600",
        blue: "bg-blue-600 hover:bg-blue-700 text-blue-600",
        yellow: "bg-yellow-500 hover:bg-yellow-600 text-yellow-500"
    };

    const confirmButtonClass = `flex-1 py-3 font-semibold px-4 text-white rounded-xl transition cursor-pointer ${colorClasses[confirmColor]?.split(' ')[0] || colorClasses.green.split(' ')[0]}`;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-8 relative">
                {/* Close Icon */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 left-6 w-10 h-10 font-bold text-[var(--text-paragraph)] hover:text-gray-700 cursor-pointer flex items-center justify-center text-2xl"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className={`text-right text-[36px] font-bold mb-2 ${colorClasses[confirmColor]?.split(' ')[2] || 'text-green'}`}>
                    {title}
                </h2>

                {/* Request Date (Conditional) */}
                {requestDate && (
                    <div className="text-right text-sm text-[var(--text-paragraph)] mb-6">
                        تاريخ تقديم الطلب: {requestDate}
                    </div>
                )}

                {/* Message */}
                <p className="text-right text-[22px] font-semibold text-[var(--text-title)] mb-4">
                    {message}
                </p>

                {/* Text Input (Conditional) */}
                {showTextInput && (
                    <div>
                        <label className="block text-right text-sm font-medium text-[var(--text-paragraph)] mb-1">
                            {textInputLabel}*
                        </label>
                        <textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (inputError) setInputError("");
                            }}
                            placeholder={textInputPlaceholder}
                            rows={4}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green focus:border-green text-right text-lg"
                        />
                        {inputError && (
                            <p className="text-red-500 text-lg mt-2 text-right">{inputError}</p>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between gap-6 pt-4">
                    <button
                        onClick={handleConfirm}
                        className={confirmButtonClass}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={handleClose}
                        className={`flex-1 py-3 px-4 font-semibold text-[var(--text-paragraph)]  hover:ring-3 ring-${confirmColor} border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer`}
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}