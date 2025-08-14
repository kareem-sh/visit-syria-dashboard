import { Star } from "lucide-react";
import Temp from "@/assets/icons/trip/temp-icon.svg";
import Tickets from "@/assets/icons/trip/tickets.svg";
import TicketPrice from "@/assets/icons/trip/ticket-price.svg";
import companyImage from "@/assets/images/Company Profile.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";

export default function ProductInfoCard({
                                            title,
                                            price,
                                            capacity,
                                            discount,
                                            refNumber,
                                            rating,
                                            tags = [],
                                            description,
                                            company,
                                            companyThumbnail = companyImage,
                                            season = "الصيف",
                                            duration,
                                            date,
                                            status = "لم تبدأ بعد",
                                        }) {

    // Status Badge logic reused from CommonTable
    const renderStatusBadge = (status) => {
        let icon, bg, text;
        switch (status) {
            case "منتهية":
                icon = doneIcon;
                bg = "bg-green-100/60";
                text = "text-grey";
                break;
            case "تم الإلغاء":
                icon = canceledIcon;
                bg = "bg-red-50";
                text = "text-red-600";
                break;
            case "جارية حالياً":
                icon = inprogressIcon;
                bg = "bg-gold-500/10";
                text = "text-gold";
                break;
            case "لم تبدأ بعد":
                icon = notyetIcon;
                bg = "bg-gray-500/10";
                text = "text-gray-600";
                break;
            default:
                return status;
        }
        return (
            <div
                className={`flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col gap-6 w-full min-h-[430px]">
            {/* Row 1: Title + Discount & Status */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-[32px] font-bold text-gray-900">{title}</h1>
                    {discount && (
                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
              {discount}%
            </span>
                    )}
                </div>

                {/* Status Badge */}
                {status && renderStatusBadge(status)}
            </div>

            {/* Row 2: Company + Rating + Season + Tickets + Price */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    {companyThumbnail && (
                        <img
                            src={companyThumbnail}
                            alt={company}
                            className="w-15 h-15 rounded-full object-cover"
                        />
                    )}
                    <div>
                        <p className="text-h1-bold-22 flex items-center gap-1 pb-1">{company}</p>
                        <p className="text-yellow-500 flex items-center gap-1 text-[16px] font-semibold">
                            {rating} <Star size={18} fill="currentColor" />
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
          <span className="flex items-center gap-1 text-black text-body-bold-16">
            <img src={Temp} alt="Season" className="w-5 h-5" /> {season || "—"}
          </span>
                    <span className="flex items-center gap-1 text-black text-body-bold-16">
            <img src={Tickets} alt="Tickets" className="w-5 h-5" /> {capacity}
          </span>
                    <span className="flex items-center gap-1 text-black text-body-bold-16">
            <img src={TicketPrice} alt="Price" className="w-5 h-5" /> {price}$
          </span>
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className="bg-gray-100 text-green px-5 py-2 rounded-full text-body-regular-14-auto"
                        >
              {tag}
            </span>
                    ))}
                </div>
            )}

            {/* Description & Extra details */}
            <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div className="text-right">
                    <p className="text-body-bold-16 pb-3">الرقم التعريفي</p>
                    <p>{refNumber}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-3">الوصف</p>
                    <p>{description}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-3">التاريخ</p>
                    <p>{date}</p>
                </div>
                <div className="text-right">
                    <p className="text-body-bold-16 pb-3">المدة</p>
                    <p>{duration ? `${duration} أيام` : "—"}</p>
                </div>
            </div>
        </div>
    );
}
