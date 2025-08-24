import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.svg";

export default function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
            <div className="text-center mb-6">
             <img
                src={logo}
                alt="Logo"
                className="w-[120px] h-[56.74px] object-contain mx-auto mb-8"
            />
            <h2 className="text-2xl font-bold text-green-700">تسجيل الدخول</h2>
            </div>
            <form className="space-y-4">
            <div>
                <label className="block text-right mb-1 text-sm">البريد الإلكتروني:</label>
                <input
                type="email"
                placeholder="Email*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-right mb-1 text-sm">كلمة المرور:</label>
                <input
                type="password"
                placeholder="Password*"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                />
            </div>
            <div className="text-right">
                <a href="#" className="text-green-600 text-sm">نسيت كلمة المرور؟</a>
            </div>
            <button
                type="button"
                onClick={() => alert("Login clicked")}
                className="w-full bg-green-600 text-white py-2 rounded-lg shadow hover:bg-green-700"
            >
                تسجيل الدخول
            </button>
            </form>
            <div className="mt-6 text-center">
            <button
                onClick={() => navigate("/register")}
                className="w-full border border-green-600 text-green-600 py-2 rounded-lg hover:bg-green-50"
            >
                إنشاء حساب شركة +
            </button>
            </div>
        </div>
        </div>
    );
}
