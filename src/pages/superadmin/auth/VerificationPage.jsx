import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verify, resendVerification, getUserRoleAndData } from "@/services/auth/AuthApi";
import { useAuth } from "@/contexts/AuthContext.jsx";
import logo from "@/assets/images/logo.svg";

export default function VerificationPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [fcmToken, setFcmToken] = useState("");
    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Get props from navigation state or use defaults
    const { title = "تغيير كلمة المرور", email = "" } = location.state || {};

    // Check if this is a password reset flow
    const isPasswordReset = title.includes("كلمة المرور") || title === "تغيير كلمة المرور";

    // Function to generate a random token string
    const generateRandomToken = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const length = 152;
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
            const form = new FormData();
            form.append("email", data.email);
            form.append("code", data.code);
            form.append("fcm_token", data.fcm_token);

            console.log("FormData being sent to API:");
            for (let [key, value] of form.entries()) {
                console.log(`${key}: ${value}`);
            }

            return await verify(form);
        },
        onSuccess: async (data) => {
            console.log("Verification successful", data);

            // must have a token to proceed
            if (!data?.token) {
                setError("لم يتم استلام رمز الدخول. يرجى المحاولة مرة أخرى.");
                return;
            }

            // If API returned a user object, use it. Otherwise fetch fresh user data using the token.
            try {
                let userToLogin = data.user ?? null;

                if (!userToLogin) {
                    // fetch user using token
                    try {
                        const fetchedUser = await getUserRoleAndData(data.token);
                        userToLogin = fetchedUser;
                    } catch (fetchErr) {
                        console.error("Failed to fetch user after verification:", fetchErr);
                        setError("فشل في تحميل بيانات المستخدم بعد التحقق. الرجاء المحاولة مرة أخرى.");
                        return;
                    }
                }

                // Use AuthContext login to set app state (this sets token, user and API token)
                login(userToLogin, data.token);

                // navigate to dashboard (SPA navigation)
                navigate("/dashboard");
            } catch (err) {
                console.error("Error during post-verification login flow:", err);
                setError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
            }
        },
        onError: (error) => {
            console.error("Verification failed", error);
            // Better error handling from server:
            const serverMessage = error?.response?.data?.message;
            const serverErrors = error?.response?.data?.errors;
            if (serverErrors) {
                const msgs = Object.values(serverErrors).flat();
                setError(msgs.join(", ") || "رمز التحقق غير صحيح");
            } else if (serverMessage) {
                setError(serverMessage);
            } else {
                setError("حدث خطأ يرجى المحاولة لاحقا");
            }
        },
    });

    // React Query mutation for resending verification code (only for registration)
    const resendMutation = useMutation({
        mutationFn: async (email) => {
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
        if (/^\d*$/.test(value) && value.length <= 4) {
            setVerificationCode(value);
            setError("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (verificationCode.length !== 4) {
            setError("يجب أن يتكون الرمز من 4 أرقام");
            return;
        }

        if (isPasswordReset) {
            navigate('/reset-password', {
                state: { email: email, code: verificationCode }
            });
            return;
        }

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
                <div className="flex justify-center">
                    <img src={logo} alt={"visit syria logo"} className="w-[200px] h-[200px] pb-12" />
                </div>

                <h2 className="text-center text-h1-bold-24 font-bold text-green">
                    {title}
                </h2>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
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

                    <button
                        type="submit"
                        disabled={!isPasswordReset && verifyMutation.isPending}
                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                    >
                        {!isPasswordReset && verifyMutation.isPending ? "جاري التحقق..." : "تأكيد"}
                    </button>

                    {!isPasswordReset && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendDisabled || resendMutation.isPending}
                                className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {resendDisabled ? `إعادة الإرسال (${countdown} ثانية)` : "إعادة الإرسال"}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
