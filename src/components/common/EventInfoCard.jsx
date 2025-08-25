import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CancelDialog from "@/components/Dialog/CancelDialog.jsx";
import ActionSuccessDialog from "@/components/Dialog/ActionSuccessDialog.jsx";

import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";
import pen from "@/assets/icons/event/pen.svg";
import bin from "@/assets/icons/event/bin.svg";

import { cancelEvent, deleteEvent } from "@/services/events/eventsApi.js";

export default function EventInfoCard(props) {
    const {
        id,
        title,
        refNumber,
        description,
        duration,
        date,
        tickets,
        price,
        eventType = "limited",
        priceType = "paid",
        preBooking = 0,
        status: initialStatus = "لم تبدأ بعد",
        onDelete,
        onEdit
    } = props;

    const navigate = useNavigate();
    const [status, setStatus] = useState(initialStatus);

    // 🔄 Sync local state whenever prop changes
    useEffect(() => {
        setStatus(initialStatus);
    }, [initialStatus]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogAction, setDialogAction] = useState(null);
    const [successOpen, setSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const openDialogFor = (action) => {
        if (action === "cancel") {
            setDialogTitle("إلغاء الحدث");
            setDialogMessage("هل أنت متأكد من إلغاء هذا الحدث؟");
        } else if (action === "delete") {
            setDialogTitle("حذف الحدث");
            setDialogMessage("هل أنت متأكد من حذف هذا الحدث نهائياً؟");
        }
        setDialogAction(action);
        setDialogOpen(true);
    };

    const handleDialogConfirm = async () => {
        setDialogOpen(false);
        try {
            if (dialogAction === "cancel") {
                await cancelEvent(id);
                setStatus("تم الإلغاء");
                setSuccessMessage("تم إلغاء الحدث بنجاح ✅");
                setSuccessOpen(true);
            } else if (dialogAction === "delete") {
                await deleteEvent(id);
                setSuccessMessage("تم حذف الحدث بنجاح 🗑️");
                setSuccessOpen(true);
                setTimeout(() => navigate("/events"), 1000);
                if (typeof onDelete === "function") onDelete(id);
            }
        } catch (err) {
            console.error("Error performing action:", err);
            setSuccessMessage("حدث خطأ أثناء العملية ❌");
            setSuccessOpen(true);
        }
        setDialogAction(null);
    };

    const renderStatusBadge = (status) => {
        let icon, bg, text;
        switch (status) {
            case "منتهية":
                icon = doneIcon; bg = "bg-green-100/60"; text = "text-grey"; break;
            case "تم الإلغاء":
                icon = canceledIcon; bg = "bg-red-50"; text = "text-red-600"; break;
            case "جارية حالياً":
                icon = inprogressIcon; bg = "bg-gold-500/10"; text = "text-gold"; break;
            case "لم تبدأ بعد":
                icon = notyetIcon; bg = "bg-gray-500/10"; text = "text-gray-600"; break;
            default: return status;
        }
        return (
            <div className={`flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text}`}>
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full min-h-[400px]">
            <div className="flex justify-between items-center">
                <h1 className="text-h1-bold-32">{title}</h1>
                {status === "لم تبدأ بعد" && (
                    <div className="flex gap-3">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-5 py-2 rounded-full text-green text-body-bold-14 border-green border-2 hover:shadow-lg cursor-pointer"
                        >
                            تعديل الحدث
                            <img src={pen} alt="edit" className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openDialogFor("cancel")}
                            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red text-white text-body-bold-14 hover:shadow-lg cursor-pointer"
                        >
                            إلغاء الحدث
                            <img src={bin} alt="delete" className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {(status === "منتهية" || status === "تم الإلغاء") && (
                    <button
                        onClick={() => openDialogFor("delete")}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-red text-white text-body-bold-14 hover:shadow-lg cursor-pointer"
                    >
                        حذف
                        <img src={bin} alt="delete" className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="text-right">
                    <p className="text-h2-bold-16 pb-2">الرقم التعريفي</p>
                    <p>{refNumber}</p>
                </div>
                <div className="flex justify-start items-center">{status && renderStatusBadge(status)}</div>

                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">التاريخ</p>
                    <p>{date}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">المدة</p>
                    <p>{duration ? `${duration} أيام` : "—"}</p>
                </div>

                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">عدد التذاكر</p>
                    <p>{eventType === "unlimited" ? "غير محدود" : tickets ?? "—"}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">سعر التذكرة</p>
                    <p>{priceType === "free" ? "مجاني" : price ? `${price} $` : "—"}</p>
                </div>

                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">الحجز المسبق</p>
                    <p>{preBooking ? "مطلوب" : "غير مطلوب"}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-2">الوصف</p>
                    <p>{description}</p>
                </div>
            </div>

            {/* Dialogs */}
            <CancelDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleDialogConfirm}
                title={dialogTitle}
                message={dialogMessage}
            />
            <ActionSuccessDialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
}
