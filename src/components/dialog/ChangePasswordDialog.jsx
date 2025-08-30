import { useState } from "react";
import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";

const ChangePasswordDialog = ({ onBack, onSubmit, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ oldPassword, newPassword, confirmPassword });
    }

    return (
        <div dir="rtl" className="bg-white p-8 z-[100000] rounded-2xl shadow-lg w-full max-w-lg absolute animate-fade-in">
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
                يرجى إدخال كلمة المرور القديمة والجديدة لتغيير كلمة المرور
            </p>

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
                    />
                    <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
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
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute left-3 top-11 text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="w-full bg-green text-white font-bold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                >
                    <span>تأكيد تغيير كلمة المرور</span>
                    <ArrowLeft size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordDialog;