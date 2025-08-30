import React, { useState } from "react";
import TravLogo from "@/assets/icons/common/trav_logo.svg";
import LogOutDialog from "@/components/dialog/LogOutDialog.jsx";
import ChangePasswordDialog from "@/components/dialog/ChangePasswordDialog.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";

const ContactUs = ({ onClose }) => {
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const { user, logout } = useAuth();

    const handleLogoutConfirm = () => {
        logout();
        setShowLogoutDialog(false);
        onClose();
    };

    return (
        <>
            {/* Backdrop with very high z-index */}
            <div
                className="fixed inset-0 bg-black/40 bg-opacity-50 z-[9998]"
                onClick={onClose}
            />

            {/* Main dialog with even higher z-index */}
            <div
                dir="rtl"
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
                <div
                    className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-2xl w-full relative transform transition-all animate-fade-in-down"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button (X) */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
                            <img src={TravLogo} alt="icon" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            وزارة السياحة في الجمهورية العربية السورية
                        </h1>
                        <p className="text-gray-500 mb-8">{user?.email}</p>

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
                            <div className="fixed inset-0 bg-black/40 bg-opacity-70 z-[10000] flex items-center justify-center">
                                <ChangePasswordDialog
                                    onBack={() => setShowChangePassword(false)}
                                    onClose={() => setShowChangePassword(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;