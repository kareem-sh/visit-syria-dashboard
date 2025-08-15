import React from "react";
import DamascusStarTop from "@/assets/images/Damascus Star Top.svg";
import DamascusStarBottom from "@/assets/images/Damascus Star Bottom.svg";
import Plus from "@/assets/icons/common/plus icon.svg";

function Banner({
                    title,
                    description,
                    icon,
                    bgColor = "bg-green",
                    buttonText = "إضافة",
                    onButtonClick
                }) {
    return (
        <div className={`relative ${bgColor} rounded-lg shadow-md h-[260px] overflow-hidden px-[96px] py-[24px] flex items-center`}>
            {/* Background Stars */}
            <img
                src={DamascusStarTop}
                alt=""
                className="absolute top-0 right-[30%] w-[180px] opacity-100 pointer-events-none"
            />
            <img
                src={DamascusStarBottom}
                alt=""
                className="absolute bottom-0 left-0 w-[180px] opacity-100 pointer-events-none"
            />

            {/* Content */}
            <div className="flex items-center justify-between w-full z-10 text-white">
                <div className="flex flex-col justify-center">
                    <h2 className="text-h1-bold-32 mb-4">{title}</h2>
                    <p className="text-body-regular-18-auto opacity-90 mb-4 leading-[28px] w-[75%]">
                        {description}
                    </p>
                    <button
                        onClick={onButtonClick} // ✅ trigger callback
                        className="flex items-center gap-2 text-white px-10 py-3 rounded-2xl font-semibold border-white border-3 shadow hover:cursor-pointer w-fit"
                    >
                        {buttonText}
                        <img src={Plus} alt="plus icon" className="w-4 h-4" />
                    </button>
                </div>

                {/* Icon */}
                <img
                    src={icon}
                    alt="icon"
                    className="w-[200px] h-[200px] flex-shrink-0 object-contain"
                />
            </div>
        </div>
    );
}

export default Banner;
