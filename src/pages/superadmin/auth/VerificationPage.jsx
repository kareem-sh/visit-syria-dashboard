import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verify, resendVerification } from "@/services/auth/AuthApi";
import logo from "@/assets/images/logo.svg";

export default function VerificationPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [fcmToken, setFcmToken] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const location = useLocation();
    const navigate = useNavigate();

    // Get props from navigation state or use defaults
    const { title = "تغيير كلمة المرور", email = "" } = location.state || {};

    // Check if this is a password reset flow
    const isPasswordReset = title.includes("كلمة المرور") || title === "تغيير كلمة المرور";

    // Function to generate a random token string
    const generateRandomToken = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const length = 152; // Typical FCM token length

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    };

    // Generate random token on component mount (only for registration)
    useEffect(() => {
        if (!isPasswordReset) {
            const randomToken = generateRandomToken();
            setFcmToken(randomToken);
        }

        // Start the countdown timer (only for registration)
        if (!isPasswordReset) {
            startCountdown();
        }
    }, [isPasswordReset]);

    // Countdown timer effect (only for registration)
    useEffect(() => {
        if (isPasswordReset) return;

        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, isPasswordReset]);

    const startCountdown = () => {
        setResendDisabled(true);
        setCountdown(60);
    };

    // React Query mutation for verification (only for registration)
    const verifyMutation = useMutation({
        mutationFn: async (data) => {
            // Build FormData
            const form = new FormData();
            form.append("email", data.email);
            form.append("code", data.code);
            form.append("fcm_token", data.fcm_token);

            // Log FormData being sent
            console.log("FormData being sent to API:");
            for (let [key, value] of form.entries()) {
                console.log(`${key}: ${value}`);
            }

            return await verify(form);
        },
        onSuccess: (data) => {
            console.log("Verification successful", data);

            // Store token and user data if available
            if (data?.token) {
                localStorage.setItem("authToken", data.token);
            }
            if (data?.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Redirect to dashboard after successful registration verification
            navigate('/dashboard');
        },
        onError: (error) => {
            console.error("Verification failed", error);
            setError("حدث خطأ يرجى المحاولة لاحقا");
        },
    });

    // React Query mutation for resending verification code (only for registration)
    const resendMutation = useMutation({
        mutationFn: async (email) => {
            // Build FormData
            const form = new FormData();
            form.append("email", email);

            return await resendVerification(form);
        },
        onSuccess: () => {
            alert(`تم إعادة إرسال الرمز إلى ${email}`);
            startCountdown();
        },
        onError: (error) => {
            console.error("Resend failed", error);
            setError("حدث خطأ يرجى المحاولة لاحقا");
        },
    });

    const handleCodeChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and limit to 4 digits
        if (/^\d*$/.test(value) && value.length <= 4) {
            setVerificationCode(value);
            setError(""); // Clear error when user types
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate the code is exactly 4 digits
        if (verificationCode.length !== 4) {
            setError("يجب أن يتكون الرمز من 4 أرقام");
            return;
        }

        // For password reset flow, just navigate to reset password page
        if (isPasswordReset) {
            // Navigate to reset password page with email and verification code
            navigate('/reset-password', {
                state: {
                    email: email,
                    code: verificationCode
                }
            });
            return;
        }

        // For registration flow, call the verification API
        verifyMutation.mutate({
            email: email,
            code: verificationCode,
            fcm_token: fcmToken
        });
    };

    const handleResendCode = () => {
        if (email && !resendDisabled) {
            resendMutation.mutate(email);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" dir="rtl">
            <div className="w-full max-w-3xl p-8">
                {/* Logo Section - Centered */}
                <div className="flex justify-center">
                    <img src={logo} alt={"visit syria logo"} className="w-[200px] h-[200px] pb-12" />
                </div>

                {/* Title - From navigation state */}
                <h2 className="text-center text-h1-bold-24 font-bold text-green">
                    {title}
                </h2>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {error}
                    </div>
                )}

                {/* Verification Form */}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {/* Verification Code Input */}
                    <div className="space-y-2">
                        <label htmlFor="verificationCode" className="block text-right text-body-bold-14 text-gray-700">
                            الرمز التأكيدي* (4 أرقام)
                        </label>
                        <input
                            id="verificationCode"
                            name="verificationCode"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            value={verificationCode}
                            onChange={handleCodeChange}
                            placeholder="أدخل الرمز المكون من 4 أرقام"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent text-center"
                            maxLength="4"
                        />
                    </div>

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        disabled={!isPasswordReset && verifyMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {!isPasswordReset && verifyMutation.isPending ? "جاري التحقق..." : "تأكيد"}
                    </button>

                    {/* Resend Code Link (only for registration) */}
                    {!isPasswordReset && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendDisabled || resendMutation.isPending}
                                className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {resendDisabled
                                    ? `إعادة الإرسال (${countdown} ثانية)`
                                    : "إعادة الإرسال"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}