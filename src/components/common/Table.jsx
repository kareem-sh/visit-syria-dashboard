import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import filterIcon from "@/assets/icons/table/dropdown.svg";
import canceledIcon from "@/assets/icons/table/canceled small.svg";
import doneIcon from "@/assets/icons/table/done small.svg";
import inprogressIcon from "@/assets/icons/table/inprogress small.svg";
import notyetIcon from "@/assets/icons/table/notyet small.svg";

const Table = ({
                 columns,
                 data,
                 rowGap = "space-y-4",
                 width = "w-full",
                 title,
                 currentFilter = "الكل",
                 onFilterChange,
               }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    "حسب التاريخ (الأقدم)",
    "حسب التاريخ (الأحدث)",
    "حسب الحالة (منتهية)",
    "حسب الحالة (تم الإلغاء)",
    "حسب الحالة (جارية الآن)",
    "حسب الحالة (لم تبدأ بعد)",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleFilterSelect = (option) => {
    setIsFilterOpen(false);
    if (onFilterChange) {
      onFilterChange(option);
    }
  };

  const renderStatusBadge = (status) => {
    let icon, bgColor, textColor;
    switch (status) {
      case "منتهية":
        icon = doneIcon;
        bgColor = "bg-green-100/60";
        textColor = "text-grey";
        break;
      case "تم الإلغاء":
        icon = canceledIcon;
        bgColor = "bg-red-50";
        textColor = "text-red-600";
        break;
      case "جارية حالياً":
        icon = inprogressIcon;
        bgColor = "bg-gold-500/10";
        textColor = "text-gold";
        break;
      case "لم تبدأ بعد":
        icon = notyetIcon;
        bgColor = "bg-gray-500/10";
        textColor = "text-gray-600";
        break;
      default:
        return status;
    }

    return (
        <div
            className={`relative flex items-center justify-center min-w-[100px] h-[32px] px-[8px] py-[6px] rounded-[16px] ${bgColor} ${textColor} box-border leading-none`}
        >
          <img src={icon} alt={status} className="w-5 h-5 ml-1" />
          <span className="text-body-regular-14-auto">{status}</span>
        </div>
    );
  };

  const handleSeeAllClick = () => {
    navigate("/trips");
  };

  const handleRowClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
      <div className={`overflow-visible relative z-10 ${width}`} dir="rtl">
        {/* Table Header */}
        <div className="flex items-center justify-between w-[950px] h-[59px] gap-[16px] px-[16px] mt-[24px]">
          <h2 className="text-h1-bold-24 text-gray-700">{title}</h2>

          {/* Filter & See All */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
                  onClick={toggleFilter}
              >
                <img src={filterIcon} alt="dropdown filter Icon" />
                <span className="text-body-bold-14-auto">فرز حسب</span>
                <FiChevronDown
                    className={`text-black transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Dropdown */}
              {isFilterOpen && (
                  <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200"
                      style={{
                        overflow: "visible",
                        maxHeight: "none",
                      }}
                  >
                    <div className="py-1">
                      {filterOptions.map((option) => (
                          <div
                              key={option}
                              className={`px-6 py-2 text-body-bold-14-auto cursor-pointer hover:bg-emerald-400 hover:text-white text-center ${
                                  currentFilter === option
                                      ? "bg-gray-100 text-primary"
                                      : "text-gray-700"
                              }`}
                              onClick={() => handleFilterSelect(option)}
                          >
                            {option}
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>

            <div
                className="flex items-center text-primary cursor-pointer hover:text-primary-dark transition-colors"
                onClick={handleSeeAllClick}
            >
            <span className="text-body-regular-14 text-(--text-see-all)">
              مشاهدة الكل
            </span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className={`flex flex-col ${rowGap} w-[950px]`}>
          <div className="grid grid-cols-5 text-center bg-white px-[16px] py-[30px] rounded-xl font-bold text-gray-600 text-sm h-[75px]">
            {columns.map((col, idx) => (
                <div key={idx}>{col.header}</div>
            ))}
          </div>

          {data.map((row, rowIndex) => (
              <div
                  key={rowIndex}
                  className="grid grid-cols-5 bg-white px-[16px] rounded-2xl shadow-sm text-sm text-gray-700 h-[75px] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleRowClick(row.id)}
              >
                {columns.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className="flex items-center justify-center gap-2 truncate text-center"
                    >
                      {col.accessor === "status"
                          ? renderStatusBadge(row[col.accessor])
                          : col.render
                              ? col.render(row[col.accessor], row)
                              : row[col.accessor]}
                    </div>
                ))}
              </div>
          ))}
        </div>
      </div>
  );
};

export default Table;
