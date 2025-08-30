import { useState } from "react";
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { changePassword } from "@/services/auth/AuthApi.js";
import { useAuth } from "@/hooks/useAuth.jsx";

const ChangePasswordDialog = ({ onBack, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { refreshUserData } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Basic validation
        if (newPassword !== confirmPassword) {
            setError("كلمة المرور الجديدة وتأكيدها غير متطابقين");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("كلمة المرور يجب أن تكون على الأقل 6 أحرف");
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('old_password', oldPassword);
            formData.append('new_password', newPassword);
            formData.append('new_password_confirmation', confirmPassword);

            const response = await changePassword(formData);

            // Password changed successfully
            setSuccess(true);

            // Optionally refresh user data if needed
            await refreshUserData();

        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'فشل تغيير كلمة المرور';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccess(false);
        onClose();
    }

    return (
        <div dir="rtl" className="bg-white p-8 z-[100000] rounded-2xl shadow-lg w-full max-w-lg absolute animate-fade-in">
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-5 left-5 text-gray-500 hover:text-gray-800 transition-colors"
                disabled={isLoading}
            >
                <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-8 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800">تغيير كلمة المرور</h2>
                <button
                    onClick={onBack}
                    className="text-gray-600 mr-3 hover:text-gray-800 transition-colors"
                    disabled={isLoading}
                >
                    <ArrowLeft size={30} />
                </button>
            </div>

            {success ? (
                <div className="text-center">
                    <div className="text-green-600 text-lg font-bold mb-4">
                        تم تغيير كلمة المرور بنجاح!
                    </div>
                    <button
                        onClick={handleClose}
                        className="bg-green text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                        موافق
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-center text-gray-600 mb-6 text-body-regular-16">
                        يرجى إدخال كلمة المرور القديمة والجديدة لتغيير كلمة المرور
                    </p>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-right">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Old Password Field */}
                        <div className="relative">
                            <label className="block text-right text-body-bold-16 text-gray-700 mb-2">
                                كلمة المرور القديمة*
                            </label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="كلمة المرور القديمة"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green text-right placeholder-gray-400"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                            >
                                {showOldPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        {/* New Password Field */}
                        <div className="relative">
                            <label className="block text-right text-body-bold-16 text-gray-700 mb-2">
                                كلمة المرور الجديدة*
                            </label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="كلمة المرور الجديدة"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green text-right placeholder-gray-400"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                            >
                                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        <p className="text-right text-xs text-gray-500 -mt-4">
                            يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة ورموز مميزة
                        </p>

                        {/* Confirm Password Field */}
                        <div className="relative">
                            <label className="block text-right text-body-bold-16 text-gray-700 mb-2">
                                تأكيد كلمة المرور الجديدة*
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="تأكيد كلمة المرور الجديدة"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green text-right placeholder-gray-400"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span>جاري التحميل...</span>
                            ) : (
                                <>
                                    <span>تأكيد تغيير كلمة المرور</span>
                                    <ArrowLeft size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChangePasswordDialog;