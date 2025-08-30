import React, { useState } from "react";
import TravLogo from "@/assets/icons/common/trav_logo.svg";
import LogOutDialog from "@/components/dialog/LogOutDialog.jsx";
import ChangePasswordDialog from "@/components/dialog/ChangePasswordDialog.jsx"; // Change this line
import {useAuth} from "@/contexts/AuthContext.jsx";

const ContactUs = ({ onClose }) => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const { user } = useAuth();
    const handleLogoutConfirm = () => {
        console.log("تم تسجيل الخروج");
        setShowLogoutDialog(false);
        onClose();
    };

    const handlePasswordSubmit = (passwordData) => {
        console.log("Changing password:", passwordData);
        // Add your password change logic here
        setShowChangePassword(false);
    };

    return (
        <div
            dir="rtl"
            className="fixed inset-0 bg-(--bg-dashboard) z-[10000] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="p-8 rounded-2xl shadow-2xl text-center max-w-2xl w-full relative transform transition-all animate-fade-in-down"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
                        <img src={TravLogo} alt="icon" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        وزارة السياحة في الجمهورية العربية السورية
                    </h1>
                    <p className="text-gray-500 mb-8">{user.email}</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            className="w-full bg-green cursor-pointer text-white py-3 px-6 rounded-lg hover:shadow-md transition duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                            onClick={() => setShowChangePassword(true)}
                        >
                            تغيير كلمة المرور
                        </button>
                        <button
                            className="w-full border cursor-pointer border-red-500 text-red-500 py-3 px-6 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onClick={() => setShowLogoutDialog(true)}
                        >
                            تسجيل الخروج
                        </button>
                    </div>

                    {/* LogOutDialog */}
                    <LogOutDialog
                        isOpen={showLogoutDialog}
                        onClose={() => setShowLogoutDialog(false)}
                        onConfirm={handleLogoutConfirm}
                    />

                    {/* ChangePasswordDialog */}
                    {showChangePassword && (
                        <ChangePasswordDialog
                            onBack={() => setShowChangePassword(false)}
                            onSubmit={handlePasswordSubmit}
                            onClose={() => setShowChangePassword(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;