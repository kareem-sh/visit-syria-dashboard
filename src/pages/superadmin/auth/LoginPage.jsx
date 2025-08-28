import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/assets/images/logo.svg";
import { login, getUserRoleAndData } from "@/services/auth/AuthApi";

// Eye open icon
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

// Eye closed icon
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
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

// Generate random FCM token
const generateRandomToken = () => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const length = 152; // Typical FCM token length

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};

export default function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fcm_token: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login: authLogin, isAuthenticated, loading: authLoading } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            const timer = setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Generate random FCM token once
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            fcm_token: generateRandomToken(),
        }));
    }, []);

    // Mutation: login
    const loginMutation = useMutation({
        mutationFn: async (data) => {
            const form = new FormData();
            form.append("email", data.email);
            form.append("password", data.password);
            form.append("fcm_token", data.fcm_token);
            return await login(form);
        },
        onSuccess: async (data) => {
            if (data?.token) {
                try {
                    const userData = await getUserRoleAndData(data.token);

                    // Store user + token globally
                    authLogin(userData, data.token);

                    // Redirect based on role
                    if (userData.role === "super_admin") {
                        navigate("/", { replace: true });
                    } else {
                        navigate("/dashboard", { replace: true });
                    }
                } catch (error) {
                    console.error("Failed to get user data after login:", error);
                    setErrors({ submit: "فشل في الحصول على بيانات المستخدم. حاول مجدداً." });
                }
            } else {
                setErrors({ submit: "لم يتم استلام رمز الدخول من الخادم." });
            }
        },
        onError: (error) => {
            console.error("Login failed", error);
            const errorMessage =
                error.response?.data?.message || "حدث خطأ يرجى المحاولة لاحقا";
            setErrors({ submit: errorMessage });
        },
    });

    // Handlers
    const togglePasswordVisibility = () =>
        setPasswordVisible((prev) => !prev);

    const handleForgotPassword = () => navigate("/forgot-password");
    const handleRegister = () => navigate("/register");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name] || errors.submit) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            loginMutation.mutate(formData);
        }
    };

    // Show loader while checking auth state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" dir="rtl">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mb-4"></div>
                    <p className="text-gray-600">جاري التحقق من حالة المصادقة...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center" dir="rtl">
            <div className="w-full max-w-3xl p-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src={Logo}
                        alt="visit syria logo"
                        className="w-[200px] h-[200px] pb-12"
                    />
                </div>

                {/* Title */}
                <h2 className="text-center text-h1-bold-24 font-bold text-green">
                    تسجيل الدخول
                </h2>

                {/* Submit error */}
                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {errors.submit}
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-right text-body-bold-14 text-gray-700"
                        >
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
                            className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left ${
                                errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm text-right mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2 mt-4">
                        <label
                            htmlFor="password"
                            className="block text-right text-body-bold-14 text-gray-700"
                        >
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
                                className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-left pr-10 ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                                aria-label={passwordVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
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

                    {/* Forgot password */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer"
                        >
                            نسيت كلمة المرور؟
                        </button>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2  focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول ›"}
                    </button>
                </form>

                {/* Register button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full flex justify-center py-4 px-4 bg-white border border-green rounded-lg text-body-bold-16 cursor-pointer text-green hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-green transition-colors duration-300"
                    >
                        + إنشاء حساب شركة
                    </button>
                </div>
            </div>
        </div>
    );
}
