import React from "react";
import logo from "@/assets/images/logo.svg";

export default function VerificationPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
            <div className="text-center mb-6">
             <img
                src={logo}
                alt="Logo"
                className="w-[120px] h-[56.74px] object-contain mx-auto mb-8"
            />
            <h2 className="text-2xl font-bold text-green-700">إنشاء حساب شركة</h2>
            </div>
            <form className="space-y-4">
            <div>
                <label className="block text-right mb-1 text-sm">الرمز التأكيدي:</label>
                <input
                type="text"
                placeholder="Verification Code*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
            </div>
            <button
                type="button"
                onClick={() => alert("Account Verified!")}
                className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700"
            >
                تأكيد
            </button>
            <div className="text-center mt-4">
                <a href="#" className="text-green-600">إعادة الإرسال</a>
            </div>
            </form>
        </div>
        </div>
    );
}
