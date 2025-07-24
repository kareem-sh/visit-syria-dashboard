import React from "react";
import StatCard from "@/components/common/StatCard";
import moneyIcon from "@/assets/icons/stats card/Stats Card Icons money.svg"
import userIcon from "@/assets/icons/stats card/Stats Card Icons user.svg"
import starIcon from "@/assets/icons/stats card/Stats Card Icons rating.svg"

const statsData = [
    {
        title: "الأرباح",
        value: "$20,300",
        subtitle: "زيادة عن الأسبوع الماضي",
        trend: "8%",
        trendDirection: "up",
        iconSrc: moneyIcon, // ✅ just the path
        bgColor: "bg-green",
        textColor: "text-white",
        route:"/profits"
    },
    {
        title: "المستخدمين",
        value: "3008",
        subtitle: "نقصان عن الأمس",
        trend: "8%",
        trendDirection: "down",
        iconSrc: userIcon, // ✅ just the path
        bgColor: "bg-white",
        textColor: "text-black",
        route:"/users"
    },
    {
        title: "التقييمات",
        value: "10000",
        subtitle: "نقصان عن الأمس",
        trend: "8%",
        trendDirection: "up",
        iconSrc: starIcon, // ✅ just the path
        bgColor: "bg-white",
        textColor: "text-black",
    },
    ];


const DashboardOverview = () => {
    return (
        <div className="flex flex-wrap gap-4">
            {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardOverview;
