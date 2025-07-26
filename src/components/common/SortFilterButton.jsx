import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import filterIcon from "@/assets/icons/table/dropdown.svg";

const SortFilterButton = ({
  options = [],
  selectedValue = "الكل",
  onChange,
  position = "right", // can be 'left', 'right', or 'auto'
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (option) => {
    setOpen(false);
    onChange?.(option);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine dropdown side
  const dropdownPositionClass =
    position === "left"
      ? "left-0"
      : position === "right"
      ? "right-0"
      : "right-0 sm:left-auto"; // fallback for auto

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
        onClick={toggleDropdown}
      >
        <img src={filterIcon} alt="dropdown filter icon" />
        <span className="text-body-bold-14-auto">فرز حسب</span>
        <FiChevronDown
          className={`text-black transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div
          className={`absolute mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200 ${dropdownPositionClass}`}
        >
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option}
                className={`px-6 py-2 text-body-bold-14-auto cursor-pointer hover:bg-emerald-400 hover:text-white text-center ${
                  selectedValue === option
                    ? "bg-gray-100 text-primary"
                    : "text-gray-700"
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilterButton;
