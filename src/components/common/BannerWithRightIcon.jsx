import React from "react";
import { useNavigate } from "react-router-dom";
import DamascusStarTop from "@/assets/images/Damascus Star Top.svg";
import DamascusStarBottom from "@/assets/images/Damascus Star Bottom.svg";
import Plus from "@/assets/icons/common/plus icon.svg";
import PoliciesComp from "@/assets/icons/common/policies-comp.svg"
import Policies from "@/assets/icons/common/policies.svg"

/**
 * A reusable banner component with a title, policies, and a navigation button.
 * It's designed to be responsive and visually appealing.
 *
 * @param {object} props The component props.
 * @param {string} props.title The main title of the banner.
 * @param {string} props.icon The source URL for the main icon on the right.
 * @param {number} props.p The number of policies for the first icon.
 * @param {number} props.p_comp The number of policies for the second icon.
 * @param {string} [props.bgColor="bg-white"] The background color Tailwind class.
 * @param {string} [props.buttonText="التفاصيل >"] The text for the button.
 * @param {string} props.navigateTo The URL path to navigate to on button click.
 */
function BannerWithRightIcon({
    title,
    icon,
    p,
    p_comp,
    bgColor = "bg-white",
    buttonText = "التفاصيل >",
    navigateTo
}) {
    const navigate = useNavigate();

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
            <div className="flex items-center justify-between w-full z-10 text-black">
                <div className="flex flex-col justify-center">
                    <h2 className="text-[40px] font-bold mb-4">{title}</h2>
                    
                    {/* Flex container for the policies, with a small gap between them */}
                    <div className="flex items-center gap-4 mb-4">
                        {/* First policy icon and text */}
                        <div className="flex items-center gap-1">
                            <img
                                src={Policies}
                                alt="Policies icon"
                                className="w-[32px] h-[32px] flex-shrink-0 object-contain"
                            />
                            <p className="text-body-regular-18-auto opacity-90">
                                {p} شروط
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
                                {p_comp} شروط
                            </p>
                        </div>
                    </div>
                    
                    {/* The navigation button */}
                    <button
                        onClick={handleButtonClick}
                        className="flex items-center text-green px-10 py-3 rounded-2xl font-semibold b shadow hover:cursor-pointer w-fit"
                    >
                        {buttonText}
                        {/* The plus icon next to the button text */}
                        <img src={Plus} alt="plus icon" className="w-4 h-4 mr-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BannerWithRightIcon;