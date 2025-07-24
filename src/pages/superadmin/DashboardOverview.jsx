import StatCard from "@/components/common/StatCard";
import useSuperAdminStats from "@/hooks/useSuperAdminStats";

export default function SuperAdminDashboard() {
    const stats = useSuperAdminStats(false); // Change to true when API is ready

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((item, idx) => (
                <StatCard key={idx} {...item} />
            ))}
        </div>
    );
}
