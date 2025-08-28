import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth/AuthApi";
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

export default function RegisterPage() {
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({});

    // React Query mutation for registration
    const registerMutation = useMutation({
        mutationFn: async (data) => {
            // Build FormData
            const form = new FormData();
            form.append("email", data.email);
            form.append("password", data.password);
            form.append("password_confirmation", data.password_confirmation);

            // ✅ Log actual FormData being sent
            console.log("FormData being sent to API:");
            for (let [key, value] of form.entries()) {
                console.log(`${key}: ${value}`);
            }

            return await register(form);
        },
        onSuccess: (data) => {
            console.log("Registration successful", data);

            // Navigate to verification page with email and title
            navigate("/verify", {
                state: {
                    title: "إنشاء حساب شركة",
                    email: formData.email
                }
            });
        },
        onError: (error) => {
            console.error("Registration failed", error);

            // Handle validation errors from server
            if (error.response?.status === 422) {
                const serverErrors = error.response.data.errors || {};
                const errorMessages = Object.values(serverErrors).flat();
                setErrors({
                    submit: errorMessages.join(', ') || "بيانات التسجيل غير صحيحة"
                });
            } else {
                const errorMessage =
                    error.response?.data?.message ||
                    "فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.";
                setErrors({ submit: errorMessage });
            }
        },
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: "",
            }));
        }
        if (errors.submit) {
            setErrors(prev => ({
                ...prev,
                submit: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "البريد الإلكتروني غير صحيح";
        }

        if (!formData.password) {
            newErrors.password = "كلمة المرور مطلوبة";
        } else if (formData.password.length < 8) {
            newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "تأكيد كلمة المرور مطلوب";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "كلمات المرور غير متطابقة";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("React State FormData (before API):", formData);
            registerMutation.mutate(formData);
        }
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
                    إنشاء حساب شركة
                </h2>

                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {errors.submit}
                    </div>
                )}

                {/* Register Form */}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-right text-body-bold-14 text-gray-700">
                            البريد الإلكتروني*
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email*"
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left ${
                                errors.email ? "border-red-500" : ""
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2 mt-4">
                        <label htmlFor="password" className="block text-right text-body-bold-14 text-gray-700">
                            كلمة المرور*
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={passwordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password*"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10 ${
                                    errors.password ? "border-red-500" : ""
                                }`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                aria-label={passwordVisible ? "Hide password" : "Show password"}
                            >
                                {passwordVisible ? (
                                    <EyeOpenIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                ) : (
                                    <EyeClosedIcon className="h-5 w-5 mr-3 cursor-pointer" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2 mt-4">
                        <label htmlFor="password_confirmation" className="block text-right text-body-bold-14 text-gray-700">
                            تأكيد كلمة المرور*
                        </label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={confirmPasswordVisible ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                placeholder="Confirm Password*"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10 ${
                                    errors.password_confirmation ? "border-red-500" : ""
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
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {registerMutation.isPending ? "جاري إنشاء الحساب..." : "تسجيل"}
                    </button>
                </form>
            </div>
        </div>
    );
}