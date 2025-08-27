import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.svg";

export default function VerificationPage() {
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    // Get props from navigation state or use defaults
    const { title = "تغيير كلمة المرور", email = "" } = location.state || {};

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


        // Navigate based on context
        if (title === "إنشاء حساب شركة") {
            // Redirect to dashboard after successful registration verification
            navigate('/dashboard');
        } else if (title.includes("كلمة المرور") || title === "تغيير كلمة المرور") {
            // Navigate to change password page for password reset flow
            navigate('/change-password');
        } else {
            // Default navigation (fallback)
            navigate('/login');
        }
    };

    const handleResendCode = () => {
        // Logic to resend verification code to the provided email
        if (email) {
            alert(`تم إعادة إرسال الرمز إلى ${email}`);
            // Here you would typically call your API to resend the code
        } else {
            alert("يرجى تقديم عنوان بريد إلكتروني صالح");
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
                        {error && (
                            <p className="text-red-500 text-sm text-right mt-1">{error}</p>
                        )}
                    </div>

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm cursor-pointer text-body-bold-16 text-white bg-green hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#2D9A8E] transition-colors duration-300 mt-6"
                    >
                        تأكيد
                    </button>

                    {/* Resend Code Link */}
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-body-bold-16 text-green hover:text-[#257c71] bg-transparent border-none cursor-pointer"
                        >
                            إعادة الإرسال
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}