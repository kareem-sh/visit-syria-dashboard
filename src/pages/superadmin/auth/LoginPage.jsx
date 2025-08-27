import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/images/logo.svg";

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
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a 16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

export default function LoginPage() {
    // State to manage password visibility
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // Function to navigate to forgot password page
    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    // Function to navigate to register page
    const handleRegister = () => {
        navigate('/register');
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = "البريد الإلكتروني مطلوب";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "البريد الإلكتروني غير صحيح";
        }

        // Password validation - at least 8 characters
        if (!formData.password) {
            newErrors.password = "كلمة المرور مطلوبة";
        } else if (formData.password.length < 8) {
            newErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Form is valid, proceed with login logic
            console.log("Login successful", formData);
            // Here you would typically make an API call to authenticate the user
            // navigate('/dashboard'); // Redirect to dashboard after successful login
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" dir="rtl">
            <div className="w-full max-w-3xl p-8">
                {/* Logo Section - Centered */}
                <div className="flex justify-center">
                    <img src={Logo} alt={"visit syria logo"} className="w-[200px] h-[200px] pb-12" />
                </div>

                {/* Title */}
                <h2 className="text-center text-h1-bold-24 font-bold text-green">
                    تسجيل الدخول
                </h2>

                {/* Login Form */}
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
                            <p className="text-red-500 text-sm text-right mt-1">{errors.email}</p>
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
                                autoComplete="current-password"
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
                            <p className="text-red-500 text-sm text-right mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer"
                        >
                            نسيت كلمة المرور؟
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2  focus:ring-[#2D9A8E] transition-colors duration-300"
                    >
                        تسجيل الدخول ›
                    </button>
                </form>

                {/* Create Account Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full flex justify-center  py-4 px-4 bg-white border border-green rounded-lg text-body-bold-16 cursor-pointer text-green hover:bg-teal-50 focus:outline-none focus:ring-2  focus:ring-green transition-colors duration-300"
                    >
                        + إنشاء حساب شركة
                    </button>
                </div>
            </div>
        </div>
    );
}