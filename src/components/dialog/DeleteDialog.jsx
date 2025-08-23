import React from "react";

export default function DeleteDialog({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title = "حذف",
                                         message = "هل أنت متأكد من الحذف؟",
                                     }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg w-170 p-8 relative">
                {/* Close Icon */}
                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 w-10 h-10 font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                    ✕
                </button>

                {/* Title */}
                <h2 className="text-right text-h1-bold-32 text-red mb-6">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-right text-body-bold-16 text-gray-700 mb-8">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex justify-between gap-6 pt-2">
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 font-semibold px-4 bg-red text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
                    >
                        تأكيد
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 font-semibold text-red border border-red rounded-xl hover:bg-red-50 transition cursor-pointer"
                    >
                        تراجع
                    </button>
                </div>
            </div>
        </div>
    );
}