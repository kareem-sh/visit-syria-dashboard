import React, { useState } from "react";
import logo from "@/assets/images/logo.svg";

// SVG icon for open eye (visible password)
const EyeOpenIcon = ({ size = 20, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// SVG icon for closed eye (hidden password)
const EyeClosedIcon = ({ size = 20, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export default function ChangePasswordPage() {
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add password validation and change logic here
        if (newPassword !== confirmPassword) {
            alert("كلمات المرور غير متطابقة");
            return;
        }
        alert("تم تغيير كلمة المرور بنجاح!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center" dir="rtl">
            <div className="w-full max-w-3xl p-8">
                {/* Logo Section - Centered */}
                <div className="flex justify-center">
                    <img src={logo} alt={"visit syria logo"} className="w-[200px] h-[200px] pb-12" />
                </div>

                {/* Title */}
                <h2 className="text-center text-h1-bold-24 font-bold text-green">
                    تغيير كلمة المرور
                </h2>

                {/* Password Change Form */}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* New Password Input */}
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-right text-body-bold-14 text-gray-700">
                            كلمة المرور الجديدة*
                        </label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={newPasswordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="كلمة المرور الجديدة"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10"
                            />
                            <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                aria-label={newPasswordVisible ? "Hide password" : "Show password"}
                            >
                                {newPasswordVisible ? (
                                    <EyeOpenIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                ) : (
                                    <EyeClosedIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password Input */}
                    <div className="space-y-2 mt-4">
                        <label htmlFor="confirmPassword" className="block text-right text-body-bold-14 text-gray-700">
                            تأكيد كلمة المرور الجديدة*
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={confirmPasswordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="تأكيد كلمة المرور الجديدة"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
                            >
                                {confirmPasswordVisible ? (
                                    <EyeOpenIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                ) : (
                                    <EyeClosedIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Change Password Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 mt-6"
                    >
                        تغيير كلمة المرور
                    </button>
                </form>
            </div>
        </div>
    );
}