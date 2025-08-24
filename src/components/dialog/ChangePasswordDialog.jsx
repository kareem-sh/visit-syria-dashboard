import React, { useState } from "react";

const ChangePasswordDialog = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log("تم تغيير كلمة المرور:", password);
      onClose();
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-2xl text-gray-700 hover:text-gray-900"
        >
          ✕
        </button>

        {/* Step 1: Email */}
        {step === 1 && (
          <div dir="rtl">
            <h2 className="text-green-600 text-2xl font-bold mb-2">
              تغيير كلمة المرور
            </h2>
            <p className="text-gray-600 mb-6">
              أدخل بريدك الإلكتروني وسيتم إرسال رمز التحقق لإعادة تعيين كلمة المرور
            </p>
            <input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-6"
            />
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              التالي &lt;
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div dir="rtl">
            <h2 className="text-green-600 text-2xl font-bold mb-2">
              تغيير كلمة المرور
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال رمز التحقق إلى بريدك الإلكتروني، يرجى إدخال الرمز لإكمال العملية بنجاح
            </p>
            <div className="flex justify-center gap-4 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 text-center border rounded-md text-lg"
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              التالي &lt;
            </button>
            <p className="text-gray-400 text-sm mt-4 text-center">
              إعادة الإرسال: 30:00
            </p>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div dir="rtl">
            <h2 className="text-green-600 text-2xl font-bold mb-2">
              تغيير كلمة المرور
            </h2>
            <p className="text-gray-600 mb-6">
              يرجى إدخال كلمة مرور جديدة لحسابك
            </p>
            <input
              type="password"
              placeholder="New Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4"
            />
            <input
              type="password"
              placeholder="Confirm New Password*"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-6"
            />
            <button
              onClick={handleNext}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              إعادة &lt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordDialog;
