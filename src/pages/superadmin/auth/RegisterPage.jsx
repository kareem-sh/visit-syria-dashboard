    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
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
            confirmPassword: ""
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
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            // Basic validation
            if (formData.password !== formData.confirmPassword) {
                alert("كلمات المرور غير متطابقة");
                return;
            }

            // Navigate to verification page with email and title
            navigate("/verify", {
                state: {
                    title: "إنشاء حساب شركة",
                    email: formData.email
                }
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
                        إنشاء حساب شركة
                    </h2>

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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left"
                            />
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10"
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
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2 mt-4">
                            <label htmlFor="confirmPassword" className="block text-right text-body-bold-14 text-gray-700">
                                تأكيد كلمة المرور*
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm Password*"
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

                        {/* Next Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 mt-6"
                        >
                            التالي
                        </button>
                    </form>
                </div>
            </div>
        );
    }