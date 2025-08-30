import React from "react";
import Lottie from "lottie-react";
import ArabicLogo from "@/assets/lottie/Arabic Logo White.json";
// import ArabicLogoWhite from "../assets/lottie/ArabicLogoWhite.json"; // for dark mode

const Preloader = ({ dark = false }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-green dark:bg-green z-50">
            <Lottie
                animationData={dark ? ArabicLogo /* or ArabicLogoWhite */ : ArabicLogo}
                loop
                autoplay
                className="w-100 h-100"
            />
        </div>
    );
};

export default Preloader;
