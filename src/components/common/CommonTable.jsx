import React from "react";
import { useNavigate } from "react-router-dom";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";
import Banned from "@/assets/icons/table/Banned.svg";
import Warning from "@/assets/icons/table/Warning.svg";
import CompanyProfile from '@/assets/images/Company Profile.svg';
import UserProfile from '@/assets/images/User Profile.svg';

const CommonTable = ({
                         columns,
                         data,
                         rowGap = "space-y-4",
                         rowHeight = "h-[75px]",
                         title,
                         basePath = "",
                         onRowClick,
                         entityType = "company", // "company" or "user"
                     }) => {
    const navigate = useNavigate();

    const gridStyle = {
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
    };

    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row);
        } else if (basePath) {
            navigate(`/${basePath}/${row.id}`);
        }
    };

    const renderStatusBadge = (status) => {
        let icon, bg, text;
        switch (status) {
            case "منتهية":
            case "نشط":
            case "مقبول":
            case "فعالة":
                icon = doneIcon;
                bg = "bg-green-100/60";
                text = "text-green";
                break;
            case "تم الإلغاء":
            case "تم الالغاء":
            case "مرفوض":
            case "قيد الحذف":
                icon = canceledIcon;
                bg = "bg-red-50";
                text = "text-red-600";
                break;
            case "حظر نهائي":
                icon = Banned;
                bg = "bg-red-50";
                text = "text-red-600";
                break;
            case "جارية حالياً":
            case "جارية حاليا":
            case "في الانتظار":
                icon = inprogressIcon;
                bg = "bg-gold-500/10";
                text = "text-gold";
                break;
            case "حظر مؤقت":
            case "تم الانذار":
            case "تم الإنذار":
                icon = Warning;
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
                className={`relative flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
        );
    };

    const renderAvatar = (row, accessor) => {
        const name = row[accessor];
        const imageUrl = row.image || row.avatar || row.profileImage;

        const fallbackImage = entityType === "company" ? CompanyProfile : UserProfile;

        if (imageUrl) {
            return (
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
                    onError={(e) => { e.target.src = fallbackImage; }}
                />
            );
        }

        if (entityType === "company") {
            return (
                <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=32`}
                    alt={name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    onError={(e) => { e.target.src = CompanyProfile; }}
                />
            );
        }

        if (entityType === "user") {
            return (
                <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&size=32`}
                    alt={name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    onError={(e) => { e.target.src = UserProfile; }}
                />
            );
        }

        return (
            <img
                src={fallbackImage}
                alt={name}
                className="w-6 h-6 rounded-full flex-shrink-0"
            />
        );
    };

    return (
        <div className="overflow-visible relative w-full">
            {title && (
                <div className="flex items-center justify-start w-full h-[59px] gap-[16px] px-[16px]">
                    <h2 className="text-h1-bold-24 text-gray-700">{title}</h2>
                </div>
            )}

            <div className={`flex flex-col w-full ${rowGap}`}>
                <div
                    className="grid text-center bg-white px-[16px] py-[30px] rounded-xl font-bold text-gray-600 text-sm h-[75px]"
                    style={gridStyle}
                >
                    {columns.map((col, idx) => (
                        <div key={idx}>{col.header}</div>
                    ))}
                </div>

                {data.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`grid bg-white px-[16px] rounded-2xl shadow-sm text-sm text-gray-700 cursor-pointer hover:shadow-md transition-shadow ${rowHeight}`}
                        style={gridStyle}
                        onClick={() => handleRowClick(row)}
                    >
                        {columns.map((col, colIndex) => {
                            const value = row[col.accessor];
                            const isNameCol = col.accessor === "company" || col.accessor === "name";
                            const isStatusCol = col.accessor === "status";

                            return (
                                <div
                                    key={colIndex}
                                    className={`flex items-center gap-2 w-full ${
                                        isNameCol
                                            ? value.length > 15
                                                ? "justify-start"
                                                : "justify-center"
                                            : "justify-center"
                                    }`}
                                >
                                    {isNameCol ? (
                                        <>
                                            {renderAvatar(row, col.accessor)}
                                            <span
                                                className="truncate"
                                                style={{
                                                    maxWidth: "140px",
                                                }}
                                                title={value}
                                            >
                                                {value}
                                            </span>
                                        </>
                                    ) : isStatusCol ? (
                                        renderStatusBadge(value)
                                    ) : col.render ? (
                                        col.render(value, row)
                                    ) : (
                                        value
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonTable;
