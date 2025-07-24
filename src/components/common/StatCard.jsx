import React from "react";
import { useNavigate } from "react-router-dom";
import bgIcon from "@/assets/icons/sidebar/Damascus Star.svg";
import upwhiteIcon from "@/assets/icons/stats card/indicator white.svg";
import upgreenIcon from "@/assets/icons/stats card/indicator green.svg";
import downIcon from "@/assets/icons/stats card/indicator red.svg";

const StatCard = ({
  title = "العنوان",
  value = "0",
  subtitle = "وصف فرعي",
  trend = "0%",
  trendDirection = "up",
  iconSrc = null,
  bgColor = "bg-white",
  textColor = "text-black",
  route = undefined,
}) => {
  const navigate = useNavigate();
  const isWhiteBg = bgColor === "bg-white";

  // Icons and color classes
  const trendIcon =
    trendDirection === "up"
      ? isWhiteBg
        ? upgreenIcon
        : upwhiteIcon
      : downIcon;

  const trendValueClass = isWhiteBg
    ? trendDirection === "up"
      ? "text-green-500"
      : "text-red-500"
    : "";

  const handleClick = () => {
    if (route) navigate(route);
  };

  return (
    <div
      onClick={route ? handleClick : undefined}
      className={`
        relative flex flex-col justify-between rounded-[16px] p-5
        ${bgColor} ${textColor} ${route ? "cursor-pointer" : "cursor-default"}
        w-full h-[200px] shadow-lg
      `}
    >
      {/* Background Icon */}
      <img
        src={bgIcon}
        alt="background icon"
        className={`
          absolute bottom-0 left-0 w-[100px] pointer-events-none select-none
          ${isWhiteBg ? "filter brightness-0 opacity-40" : "opacity-100"}
        `}
      />

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="text-body-regular-16 whitespace-nowrap truncate max-w-[70%]">
          {title}
        </span>
        <div className="bg-black/10 p-2 rounded-[10px] flex-shrink-0">
          <img src={iconSrc} alt="stat icon" className="w-6 h-6" />
        </div>
      </div>

      {/* Main Value */}
      <div className="text-h1-bold-32 text-right mt-4 truncate">{value}</div>

      {/* Trend + Subtitle */}
      <div className="flex justify-start items-center gap-1 mt-auto">
        <img
          src={trendIcon}
          alt="trend icon"
          className="w-4 h-4 flex-shrink-0"
        />
        <span
          className={`text-body-regular-16 ${trendValueClass} flex-shrink-0`}
        >
          {trend}
        </span>
        <span className="text-body-regular-16 truncate">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatCard;
