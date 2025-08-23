import React, { useState, useEffect } from "react";
import { XIcon } from "lucide-react";

const UnbanUserDialog = ({
                             userName,
                             userId,
                             onUnban,
                             onClose,
                             isLoading,
                             onBanExpired,
                             fetchUserData // Function to fetch current user data from server
                         }) => {
    const [timeLeft, setTimeLeft] = useState("loading");
    const [isBanExpired, setIsBanExpired] = useState(false);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        const fetchCurrentBanStatus = async () => {
            try {
                // Don't refetch if ban has already expired in this session
                if (hasExpired) return;

                setTimeLeft("loading");
                const userData = await fetchUserData(userId);

                if (!userData || !userData.remaining_date_for_unblock) {
                    setTimeLeft("permanent");
                    return;
                }

                const { days, hours, minutes, seconds } = userData.remaining_date_for_unblock;

                // If all values are 0 or negative, the ban has expired
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    setTimeLeft("expired");
                    setIsBanExpired(true);
                    setHasExpired(true);
                    // Notify parent to update header status
                    if (onBanExpired) {
                        onBanExpired();
                    }
                } else {
                    setTimeLeft({
                        days: Math.max(0, days),
                        hours: Math.max(0, hours),
                        minutes: Math.max(0, minutes),
                        seconds: Math.max(0, seconds)
                    });
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setTimeLeft("error");
            }
        };

        fetchCurrentBanStatus();
    }, [userId, fetchUserData, onBanExpired, hasExpired]);

    useEffect(() => {
        // Don't start timer for permanent, expired, or error states
        if (typeof timeLeft === "string") return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (typeof prevTime !== "object") return prevTime;

                let { days, hours, minutes, seconds } = prevTime;

                // Decrement seconds
                seconds--;

                // Handle time rollover
                if (seconds < 0) {
                    seconds = 59;
                    minutes--;

                    if (minutes < 0) {
                        minutes = 59;
                        hours--;

                        if (hours < 0) {
                            hours = 23;
                            days--;

                            if (days < 0) {
                                // Ban expired - notify parent to update header
                                setIsBanExpired(true);
                                setHasExpired(true);
                                if (onBanExpired) {
                                    onBanExpired();
                                }
                                return "expired";
                            }
                        }
                    }
                }

                return { days, hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onBanExpired]);

    const formatTimeLeft = () => {
        if (timeLeft === "permanent") {
            return "حظر دائم";
        } else if (timeLeft === "expired") {
            return "انتهت مدة الحظر";
        } else if (timeLeft === "loading") {
            return "جاري التحميل...";
        } else if (timeLeft === "error") {
            return "خطأ في تحميل البيانات";
        } else if (typeof timeLeft === "object") {
            // Format the time with proper Arabic pluralization
            const daysText = timeLeft.days > 0 ? `${timeLeft.days} يوم ` : "";
            const hoursText = timeLeft.hours > 0 ? `${timeLeft.hours} ساعة ` : "";
            const minutesText = timeLeft.minutes > 0 ? `${timeLeft.minutes} دقيقة ` : "";
            const secondsText = timeLeft.seconds > 0 ? `${timeLeft.seconds} ثانية` : "";

            return `${daysText}${hoursText}${minutesText}${secondsText}`.trim() || "0 ثانية";
        }

        return "معلومات غير متاحة";
    };

    const getTimeLeftClassName = () => {
        if (timeLeft === "permanent") {
            return "text-red-600 font-medium";
        } else if (timeLeft === "expired") {
            return "text-green-600";
        } else if (timeLeft === "loading") {
            return "text-gray-500";
        } else if (timeLeft === "error") {
            return "text-red-500";
        } else if (typeof timeLeft === "object") {
            return "text-red-600 font-medium";
        }

        return "text-gray-600";
    };

    // Get the prefix text based on the timeLeft state
    const getPrefixText = () => {
        if (timeLeft === "permanent") {
            return "نوع الحظر: ";
        } else if (timeLeft === "expired") {
            return "حالة الحظر: ";
        } else {
            return "المدة المتبقية لانتهاء الحظر: ";
        }
    };

    // Check if button should be disabled
    const isButtonDisabled = isLoading || isBanExpired || timeLeft === "expired" || timeLeft === "loading";

    return (
        <div className="fixed inset-0 z-9999 min-h-screen flex items-center justify-center bg-black/40 font-inter">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-h1-bold-24 text-green">
                        إلغاء حظر {userName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none"
                        disabled={isLoading}
                    >
                        <XIcon size={28} className="cursor-pointer" />
                    </button>
                </div>

                {/* Confirmation and info */}
                <div className="text-right mb-8">
                    <h3 className="text-body-bold-16 text-gray-800 mb-4">
                        هل أنت متأكد من إلغاء الحظر؟
                    </h3>

                    <div className="space-y-2">
                        <p className="text-body-regular-14 text-gray-600">
                            {getPrefixText()}
                            <span className={getTimeLeftClassName()}>
                                {formatTimeLeft()}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Action button */}
                <div className="flex justify-center">
                    <button
                        onClick={onUnban}
                        className="w-full bg-green cursor-pointer text-white py-4 px-6 rounded-full text-body-bold-16 hover:bg-green-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isButtonDisabled}
                    >
                        {isLoading ? "جاري الإلغاء..." :
                            isBanExpired || timeLeft === "expired" ? "انتهت مدة الحظر" :
                                timeLeft === "loading" ? "جاري التحميل..." : "إلغاء الحظر"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnbanUserDialog;