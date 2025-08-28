import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth/AuthApi";
import logo from "@/assets/images/logo.svg";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // React Query mutation for forgot password
    const forgotPasswordMutation = useMutation({
        mutationFn: async (email) => {
            // Build FormData
            const form = new FormData();
            form.append("email", email);

            return await forgotPassword(form);
        },
        onSuccess: (data) => {
            console.log("Password reset email sent", data);

            // Navigate to verification page with props
            navigate('/verify', {
                state: {
                    title: "تغيير كلمة المرور",
                    email: email
                }
            });
        },
        onError: (error) => {
            console.error("Password reset failed", error);
            setErrors({ submit: "حدث خطأ يرجى المحاولة لاحقا" });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Basic validation
        if (!email) {
            setErrors({ email: "البريد الإلكتروني مطلوب" });
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors({ email: "البريد الإلكتروني غير صحيح" });
            return;
        }

        // Call the forgot password API
        forgotPasswordMutation.mutate(email);
    };

    const handleBackToLogin = () => {
        navigate('/login');
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
                    نسيت كلمة المرور
                </h2>

                {errors.submit && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {errors.submit}
                    </div>
                )}

                {/* Forgot Password Form */}
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
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email || errors.submit) {
                                    setErrors({});
                                }
                            }}
                            placeholder="أدخل بريدك الإلكتروني"
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

                    {/* Send Reset Link Button */}
                    <button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {forgotPasswordMutation.isPending ? "جاري الإرسال..." : "تأكيد"}
                    </button>

                    {/* Back to Login Link */}
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer"
                        >
                            العودة إلى تسجيل الدخول
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}