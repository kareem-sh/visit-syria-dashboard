import { useState } from "react";
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";

const ChangePasswordDialog = ({ onBack, onSubmit, onClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ newPassword, confirmPassword });
    }

    return (
        <div dir="rtl" className="bg-white p-8 z-[100000] rounded-2xl shadow-lg w-full max-w-md absolute animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-5 left-5 text-gray-500 hover:text-gray-800 transition-colors"
            >
                <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-8 flex items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-800">تغيير كلمة المرور</h2>
                <button
                    onClick={onBack}
                    className="text-gray-600 mr-3 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft size={30} />
                </button>
            </div>

            <p className="text-center text-gray-600 mb-6 text-body-regular-16">
                يرجى إدخال كلمة مرور جديدة لحسابك
            </p>

            <form onSubmit={handleSubmit}>
                {/* New Password Field */}
                <div className="mb-4 relative">
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
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                <p className="text-right text-xs text-gray-500 mb-4 -mt-2">
                    يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة ورموز مميزة
                </p>

                {/* Confirm Password Field */}
                <div className="mb-6 relative">
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
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-green text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <span>تأكيد</span>
                    <ArrowLeft size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordDialog;