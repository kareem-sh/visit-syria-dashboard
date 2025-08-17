import React from "react";
import { useNavigate } from "react-router-dom";
import doneIcon from "@/assets/icons/table/done small.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";

const CommonTable = ({
                         columns,
                         data,
                         rowGap = "space-y-4",
                         rowHeight = "h-[75px]",
                         title,
                         basePath = "",
                         onRowClick, // NEW prop
                     }) => {
    const navigate = useNavigate();

    const gridStyle = {
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
    };

    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row); // NEW: Use custom handler if provided
        } else if (basePath) {
            navigate(`/${basePath}/${row.id}`); // Existing navigation
        }
    };

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
                className={`relative flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bg} ${text} box-border leading-none`}
            >
                <img src={icon} alt={status} className="w-5 h-5 ml-1" />
                <span className="text-body-regular-14-auto">{status}</span>
            </div>
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
                        onClick={() => handleRowClick(row)} // Changed to pass entire row
                    >
                        {columns.map((col, colIndex) => (
                            <div
                                key={colIndex}
                                className="flex items-center justify-center gap-2 truncate text-center"
                            >
                                {col.accessor === "company" ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                                row.company
                                            )}&size=32`}
                                            alt={row.company}
                                            className="w-6 h-6 rounded-full flex-shrink-0"
                                        />
                                        <span>{row.company}</span>
                                    </div>
                                ) : col.accessor === "status" ? (
                                    renderStatusBadge(row[col.accessor])
                                ) : col.render ? (
                                    col.render(row[col.accessor], row)
                                ) : (
                                    row[col.accessor]
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonTable;