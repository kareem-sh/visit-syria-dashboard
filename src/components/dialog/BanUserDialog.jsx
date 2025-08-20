import React, { useState } from 'react';
import {XIcon} from "lucide-react";

const BanUserDialog = ({ userName, onBan, onClose }) => {
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('حظر نهائي');

    const durationOptions = [
        { label: 'دقيقة', value: 'دقيقة' },
        { label: 'ساعة', value: 'ساعة' },
        { label: 'يوم', value: 'يوم' },
        { label: 'أسبوع', value: 'أسبوع' },
        { label: 'شهر', value: 'شهر' },
        { label: 'سنة', value: 'سنة' },
        { label: 'حظر نهائي', value: 'حظر نهائي' },
    ];

    const handleBan = () => {
        if (reason.trim() === '') {
            alert('يرجى تقديم سبب للحظر.');
            return;
        }

        // Determine if it's a permanent ban
        const isPermanent = duration === 'حظر نهائي';
        onBan(reason, duration, isPermanent);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 font-inter">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mt-4 pb-8">
                    <h2 className="text-h1-bold-32 text-red-600">
                        حظر {userName}
                    </h2>
                    <button onClick={onClose} className="text-gray-700 cursor-pointer hover:text-gray-900 text-3xl font-light leading-none">
                        <XIcon size={28}/>
                    </button>
                </div>

                {/* Confirmation and explanation */}
                <div className="mb-6 text-right">
                    <h3 className="text-h2-bold-18 font-semibold mb-2">هل أنت متأكد من الحظر؟</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        عند الحظر لن يستطيع المستخدم حجز رحلات، أحداث، تذاكر طيران، ولن يستطيع أن يقوم بتنزيل منشورات على
                        المجتمع. لن يستطيع أيضاً التفاعل مع المنشورات الأخرى ولا حتى التعليق، بالإضافة لعدم القدرة على التقييم و
                        التعليق لـ المطاعم و الفنادق و المواقع السياحية و حتى لن يستطيع استخدام المساعد الذكي.
                    </p>
                </div>

                {/* Reason input */}
                <div className="text-right">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                        أسباب الحظر*
                    </label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="4"
                        maxLength="1000"
                        className={`w-full border border-gray-300 rounded-xl p-4 text-right resize-none focus:ring-2 focus:border-0 focus:outline-none ${
                            duration === 'حظر نهائي'
                                ? 'focus:ring-red-500 focus:border-red-500'
                                : 'focus:ring-gold-500 focus:border-gold-500'
                        }`}
                        placeholder="أسباب الحظر*"
                        style={{ direction: 'rtl' }}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-left">
                        {reason.length}/1000
                    </div>
                </div>

                {/* Duration options */}
                <div className="mb-6 text-right">
                    <h4 className="text-h2-bold-16 mb-4">مدة الحظر</h4>
                    <div className="flex flex-wrap-reverse justify-between gap-2">
                        {durationOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setDuration(option.value)}
                                className={`py-2 px-7 rounded-full text-sm transition-colors duration-200 cursor-pointer
                                  ${duration === option.value && option.value === 'حظر نهائي'
                                    ? 'bg-red-600 text-white'
                                    : duration === option.value && option.value !== 'حظر نهائي'
                                        ? 'bg-gold-500 text-white'
                                        : (option.value === 'حظر نهائي'
                                            ? 'bg-red-50 text-red-600 hover:bg-red-500 hover:text-white'
                                            : 'bg-gold-100 text-gold-600 hover:bg-gold-500 hover:text-white')
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action button */}
                <div className="flex w-full pt-2">
                    <button
                        onClick={handleBan}
                        className="w-full bg-red-500 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                    >
                        حظر
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BanUserDialog;