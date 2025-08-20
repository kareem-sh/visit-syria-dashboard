import React from 'react';
import {XIcon} from "lucide-react";

const UnbanUserDialog = ({ userName, banDuration, onUnban, onClose }) => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 font-inter">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-right mb-6">
                    <h2 className="text-h1-bold-24 text-green">
                        إلغاء حظر {userName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
                    >
                        <XIcon name="close" size={28} className="cursor-pointer"/>
                    </button>
                </div>

                {/* Confirmation and info */}
                <div className="text-right mb-8">
                    <h3 className="text-body-bold-16 text-gray-800 mb-4">هل أنت متأكد من إلغاء الحظر؟</h3>
                    {banDuration && (
                        <p className="text-body-regular-14 text-gray-600">
                            مدة انتهاء الحظر: {banDuration}
                        </p>
                    )}
                </div>

                {/* Action button */}
                <div className="flex justify-center">
                    <button
                        onClick={onUnban}
                        className="w-full bg-green cursor-pointer text-white py-4 px-6 rounded-full text-body-bold-16 hover:bg-green-dark transition-colors duration-200"
                    >
                        إلغاء الحظر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnbanUserDialog;