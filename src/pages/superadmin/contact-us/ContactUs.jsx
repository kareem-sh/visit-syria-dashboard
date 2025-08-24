import React, { useState } from "react";
import TravLogo from "@/assets/icons/common/trav_logo.svg";
import LogOutDialog from "@/components/dialog/LogOutDialog.jsx";
import ChangePasswordDialog from "@/components/dialog/ChangePasswordDialog.jsx";

const ContactUs = ({ onClose }) => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleLogoutConfirm = () => {
        // 👇 هون بتحط منطق تسجيل الخروج
        console.log("تم تسجيل الخروج");
        setShowLogoutDialog(false);
        onClose(); // يسكر البروفايل كمان
    };
    return (
        <div
        dir="rtl"
        className="fixed inset-0 bg-white z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
        >
        <div
            className="bg-gray-50 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full relative border-t-4 border-teal-500 transform transition-all animate-fade-in-down"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
                <img src={TravLogo} alt="icon" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                وزارة السياحة في الجمهورية العربية السورية
            </h1>
            <p className="text-gray-500 mb-8">tourismministry@gmail.com</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <button className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                onClick={() => setShowChangePassword(true)}>
                تغيير كلمة المرور
                </button>
                <button className="w-full border border-red-500 text-red-500 py-3 px-6 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setShowLogoutDialog(true)}>
                تسجيل الخروج
                </button>
            </div>
            {/* 👇 LogOutDialog */}
                <LogOutDialog
                    isOpen={showLogoutDialog}
                    onClose={() => setShowLogoutDialog(false)}
                    onConfirm={handleLogoutConfirm}
                />
                <ChangePasswordDialog
                    isOpen={showChangePassword}
                    onClose={() => setShowChangePassword(false)}
                />
            </div>
        </div>
        </div>
    );
};

export default ContactUs;
