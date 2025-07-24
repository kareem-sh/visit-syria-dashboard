import { useEffect, useState } from "react";
import { getSuperAdminStats } from "@/api/dashboard";

// Custom Hook to load stats
export default function useSuperAdminStats(useApi = false) {
    const [stats, setStats] = useState([]);

    const MOCK_STATS = [
        { title: "التقييمات", value: "10000", subtitle: "زيادة عن أمس 8%", color: "bg-white", textColor: "text-black" },
        { title: "المستخدمين", value: "3005", subtitle: "نقصان عن أمس 8%", color: "bg-white", textColor: "text-black" },
        { title: "الأرباح", value: "$20,300", subtitle: "زيادة عن الأسبوع الماضي 8%", color: "bg-green-500", textColor: "text-white" },
    ];

    useEffect(() => {
        if (useApi) {
            getSuperAdminStats()
                .then(res => setStats(res.data))
                .catch(err => console.error(err));
        } else {
            setStats(MOCK_STATS);
        }
    }, [useApi]);

    return stats;
}
