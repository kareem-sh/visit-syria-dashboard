import React from "react";
import arrow from "@/assets/icons/place/arrow.svg";

export default function InfoBox({ icon, title, count, onClick }) {
    return (
        <div className="flex flex-col items-start pr-4">
            <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center">
                    <img src={icon} alt={title} className="w-7 h-7"/>
                </div>
                <span className="font-semibold min-w-[50px] whitespace-nowrap">
          {title}
        </span>
            </div>

            <span className="text-gray-600 min-w-[100px]">{count}</span>

            <button
                onClick={onClick}
                className="text-green pr-10 text-sm mt-1"
            >
        <span className="flex items-center text-body-caption-12 gap-1 hover:cursor-pointer">
          التفاصيل
          <img src={arrow} alt="arrow" />
        </span>
            </button>
        </div>
    );
}
