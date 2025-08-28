import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth/AuthApi";
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

export default function ResetPasswordPage() {
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // Get email from navigation state
    const { email = "", code = "" } = location.state || {};

    // React Query mutation for reset password
    const resetPasswordMutation = useMutation({
        mutationFn: async (data) => {
            // Build FormData
            const form = new FormData();
            form.append("email", data.email);
            form.append("code", data.code);
            form.append("new_password", data.new_password);
            form.append("new_password_confirmation", data.new_password_confirmation);

            return await resetPassword(form);
        },
        onSuccess: (data) => {
            console.log("Password reset successful", data);
            alert("تم تغيير كلمة المرور بنجاح!");

            // Redirect to login page after successful password reset
            navigate('/login');
        },
        onError: (error) => {
            console.error("Password reset failed", error);
            setErrors({ submit: "حدث خطأ يرجى المحاولة لاحقا" });
        },
    });

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validation
        if (!newPassword) {
            setErrors({ newPassword: "كلمة المرور الجديدة مطلوبة" });
            return;
        } else if (newPassword.length < 8) {
            setErrors({ newPassword: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" });
            return;
        }

        if (!confirmPassword) {
            setErrors({ confirmPassword: "تأكيد كلمة المرور مطلوب" });
            return;
        } else if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "كلمات المرور غير متطابقة" });
            return;
        }

        // Call the reset password API
        resetPasswordMutation.mutate({
            email: email,
            code: code,
            new_password: newPassword,
            new_password_confirmation: confirmPassword
        });
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

                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {errors.submit}
                    </div>
                )}

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
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if (errors.newPassword) {
                                        setErrors({});
                                    }
                                }}
                                placeholder="كلمة المرور الجديدة"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10 ${
                                    errors.newPassword ? "border-red-500" : ""
                                }`}
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
                        {errors.newPassword && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.newPassword}
                            </p>
                        )}
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
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (errors.confirmPassword) {
                                        setErrors({});
                                    }
                                }}
                                placeholder="تأكيد كلمة المرور الجديدة"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10 ${
                                    errors.confirmPassword ? "border-red-500" : ""
                                }`}
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
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Change Password Button */}
                    <button
                        type="submit"
                        disabled={resetPasswordMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {resetPasswordMutation.isPending ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور"}
                    </button>
                </form>
            </div>
        </div>
    );
}