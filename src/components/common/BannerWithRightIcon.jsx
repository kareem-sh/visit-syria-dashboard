import React from "react";
import { useNavigate } from "react-router-dom";
import DamascusStarTop from "@/assets/images/Damascus Star Top.svg";
import DamascusStarBottom from "@/assets/images/Damascus Star Bottom.svg";
import PoliciesComp from "@/assets/icons/common/policies-comp.svg"
import Policies from "@/assets/icons/common/policies.svg"
import { ChevronLeft } from "lucide-react";

function BannerWithRightIcon({
    title,
    icon,
    p,
    p_comp,
    bgColor = "bg-white",
    buttonText = "التفاصيل",
    navigateTo
}) {
    const navigate = useNavigate();

    const isFAQ = title !== "الأسئلة الشائعة";

    const handleButtonClick = () => {
        if (navigateTo) {
            navigate(navigateTo);
        }
    };

    return (
        // The main banner container with controlled gap and padding
        <div className={`relative ${bgColor} rounded-[16px] shadow-md h-[260px] overflow-hidden px-[96px] gap-8 py-[24px] flex items-center border-2 border-green`}>
            {/* Background Stars (for visual flair) */}
            <img
                src={DamascusStarTop}
                alt=""
                className="absolute top-0 right-[30%] w-[180px] opacity-80 pointer-events-none filter brightness-0"
            />
            <img
                src={DamascusStarBottom}
                alt=""
                className="absolute bottom-0 left-0 w-[180px] opacity-80 pointer-events-none filter brightness-0"
            />
            {/* Main icon on the right side of the banner */}
            <img
                src={icon}
                alt="icon"
                className="w-[200px] h-[200px] flex-shrink-0 object-contain"
            />
            
            {/* Main content container */}
            <div className="flex w-full z-10 text-black">
                <div className="flex flex-col items-start">
                    <h2 className="text-[40px] font-bold mb-4">{title}</h2>
                    
                    {/* Flex container for the policies, with a small gap between them */}
                    <div className="flex gap-4 mb-4">
                        {/* First policy icon and text */}
                        <div className="flex items-center gap-1">
                            <img
                                src={Policies}
                                alt="Policies icon"
                                className="w-[32px] h-[32px] flex-shrink-0 object-contain"
                            />
                            <p className="text-body-regular-18-auto opacity-90">
                                {p} {isFAQ ? "شروط" : "سؤال"}
                            </p>
                        </div>
                        
                        {/* Second policy icon and text */}
                        <div className="flex items-center gap-1">
                            <img
                                src={PoliciesComp}
                                alt="Policies comparison icon"
                                className="w-[32px] h-[32px] flex-shrink-0 object-contain"
                            />
                            <p className="text-body-regular-18-auto opacity-90">
                                {p_comp}{isFAQ ? "شروط" : "سؤال"}
                            </p>
                        </div>
                    </div>
                    
                    {/* The navigation button */}
                    <button
                        onClick={handleButtonClick}
                        className="flex  text-green  py-3 rounded-2xl font-semibold hover:cursor-pointer "
                    >
                        {buttonText}
                        {/* The plus icon next to the button text */}
                        <ChevronLeft size={20}  />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BannerWithRightIcon;