// src/components/common/HeaderInfoCard.jsx
import React, { useState } from 'react';
import { Star, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import ChangePasswordDialog from '@/components/dialog/ChangePasswordDialog.jsx';

// Import all necessary icons
import CompanyProfile from '@/assets/images/Company Profile.svg';
import UserProfile from '@/assets/images/User Profile.svg';
import Banned from "@/assets/icons/table/Banned.svg";
import Warning from "@/assets/icons/table/Warning.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import trips from "@/assets/icons/common/trips.svg";
import calender from "@/assets/icons/common/calender.svg";
import BannedStroke from "@/assets/icons/common/Banned Stroke.svg";

export default function HeaderInfoCard({
                                           title,
                                           entityType,
                                           imageUrl,
                                           rating,
                                           stats,
                                           date,
                                           status,
                                           onStatusChangeClick,
                                       }) {
    const { isSuperAdmin, user: authUser } = useAuth(); // Get auth user data
    const [showChangePassword, setShowChangePassword] = useState(false);

    if (!title) return null;

    const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) : null;

    const statusDetails = {
        'فعالة': { text: 'فعالة', icon: doneIcon, bg: 'bg-green-100/60', text_color: 'text-green' },
        'نشط': { text: 'نشط', icon: doneIcon, bg: 'bg-green-100/60', text_color: 'text-green' },
        'حظر مؤقت': { text: 'حظر مؤقت', icon: Warning, bg: 'bg-gold-500/10', text_color: 'text-gold' },
        'تم الإنذار': { text: 'تم الإنذار', icon: Warning, bg: 'bg-gold-500/10', text_color: 'text-gold' },
        'تم الانذار': { text: 'تم الإنذار', icon: Warning, bg: 'bg-gold-500/10', text_color: 'text-gold' },
        'حظر نهائي': { text: 'حظر نهائي', icon: Banned, bg: 'bg-red-50', text_color: 'text-red-600' },
        'قيد الحذف': { text: 'قيد الحذف', icon: canceledIcon, bg: 'bg-red-50', text_color: 'text-red-600' },
        'default': { text: 'غير محدد', icon: null, bg: 'bg-gray-100', text_color: 'text-gray-600' },
    };

    const currentStatus = statusDetails[status] || statusDetails['default'];

    // Check if user is banned
    const isBanned = status === 'حظر مؤقت' || status === 'حظر نهائي';

    // Check if user is admin with active company
    const isAdminWithActiveCompany = authUser?.role === 'admin' && authUser?.company?.status === 'فعالة';

    return (
        <>
            <div className="bg-white px-10 py-6 min-h-[288px] rounded-2xl shadow-sm w-full flex items-center justify-between flex-wrap gap-4" dir="rtl">
                {/* Right Side: Logo, Name, Rating */}
                <div className="flex items-center gap-8 pr-4">
                    <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center">
                        <img
                            src={imageUrl || (entityType === 'user' ? UserProfile : CompanyProfile)}
                            alt={title}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div>
                        <h1 className="text-h1-bold-32 text-gray-800">{title}</h1>
                        {entityType === 'company' && rating > 0 && (
                            <div className="flex items-center gap-1 text-yellow-500 mt-1">
                                <Star size={20} fill="currentColor" />
                                <span className="text-xl font-bold text-gray-700">{rating}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle: Conditional Stats */}
                {entityType === 'company' && (
                    <div className="flex flex-col items-start gap-2 text-gray-600">
                        <div className="flex items-center gap-2">
                            <img src={trips}  alt={formattedDate} />
                            <span className="font-semibold text-black text-lg">{stats ?? 0}</span>
                            <span className="text-body-bold-16 text-black">رحلة</span>
                        </div>
                        {formattedDate && (
                            <div className="flex items-center gap-2">
                                <img src={calender}  alt={formattedDate} />
                                <span className="pt-1.5 text-black">{formattedDate}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Left Side: Conditional Status and Actions */}
                <div className="flex flex-col items-center gap-4">
                    {/* Company Status and Button (Stacked) */}
                    {entityType === 'company' && (
                        <>
                            <span className={`flex items-center justify-center min-w-[150px] px-5 py-3 text-center text-md font-semibold rounded-full ${currentStatus.bg} ${currentStatus.text_color}`}>
                                {currentStatus.icon && <img src={currentStatus.icon} alt={currentStatus.text} className="ml-1 w-6 h-6" />}
                                {currentStatus.text}
                            </span>

                            {/* Show different buttons based on user role and status */}
                            {isSuperAdmin && (
                                <button
                                    onClick={onStatusChangeClick}
                                    className="w-full cursor-pointer bg-green text-white px-5 py-3 rounded-full text-body-bold-14 hover:shadow-lg transition-shadow duration-200"
                                >
                                    تغيير حالة الشركة
                                </button>
                            )}
                            {isAdminWithActiveCompany && (
                                <button
                                    onClick={() => setShowChangePassword(true)}
                                    className="w-full cursor-pointer bg-green text-white px-5 py-3 rounded-full text-body-bold-14 hover:shadow-lg transition-shadow duration-200"
                                >
                                    تغيير كلمة المرور
                                </button>
                            )}
                        </>
                    )}

                    {/* User Status and Button (Side-by-side) */}
                    {entityType === 'user' && (
                        <div className="flex items-center gap-4">
                            {/* Show user ban button only for super admin */}
                            {isSuperAdmin && (
                                <button
                                    onClick={onStatusChangeClick}
                                    className={`flex items-center justify-center cursor-pointer gap-2 min-w-[150px] rounded-full text-body-bold-14 hover:shadow-lg transition-shadow duration-200 ring-2 px-5 py-3 ${
                                        isBanned
                                            ? 'ring-green text-green'
                                            : 'ring-red text-red'
                                    }`}
                                >
                                    {isBanned ? 'إلغاء الحظر' : 'حظر'}
                                    <img
                                        src={isBanned ? doneIcon : BannedStroke}
                                        alt={isBanned ? 'إلغاء الحظر' : 'حظر المستخدم'}
                                        className="w-5 h-5"
                                    />
                                </button>
                            )}
                            <span className={`flex items-center justify-center min-w-[150px] px-5 py-3 text-center text-md font-semibold rounded-full ${currentStatus.bg} ${currentStatus.text_color}`}>
                                {currentStatus.text}
                                {currentStatus.icon && <img src={currentStatus.icon} alt={currentStatus.text} className="mr-1 w-6 h-6" />}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Change Password Dialog */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-[100000] flex items-center justify-center">
                    <ChangePasswordDialog
                        onBack={() => setShowChangePassword(false)}
                        onClose={() => setShowChangePassword(false)}
                    />
                </div>
            )}
        </>
    );
}