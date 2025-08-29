import React, { useState, useMemo, useCallback } from "react";
import LineChart from "@/components/common/LineChart.jsx";
import Table from "@/components/common/CommonTable.jsx";
import SortFilterButton from "@/components/common/SortFilterButton.jsx";
import { useAuth } from "@/contexts/AuthContext";
import PendingIcon from "@/assets/icons/common/notification_icon.svg";
import NoAccessImage from "@/assets/images/Request.png";
import { ArrowLeft } from "lucide-react";
import CompanyDialog from "@/components/dialog/CompanyDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCompany } from "@/services/auth/AuthApi.js";
import { getTrips} from "@/services/trips/trips.js";
import { getEarningsThisYear, getRatingsThisYear } from "@/services/companies/companiesApi.js"
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";

// Table columns
const columns = [
    { header: "الرقم التعريفي", accessor: "id" },
    { header: "اسم الرحلة", accessor: "name" },
    { header: "التاريخ", accessor: "start_date" },
    { header: "المدة", accessor: "days" },
    { header: "عدد التذاكر", accessor: "tickets" },
    { header: "سعر التذكرة", accessor: "price" },
    { header: "الحالة", accessor: "status" },
];

// Filter options
const filterOptions = [
    { label: "الأحدث", value: "latest" },
    { label: "الأقدم", value: "oldest" },
    { label: "الأعلى تقييماً", value: "highest" },
    { label: "الأدنى تقييماً", value: "lowest" },
];

const DashboardOverview = () => {
    const { user: authUser } = useAuth();
    const [currentFilter, setCurrentFilter] = useState("الأحدث");
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);

    // Determine role and status safely
    const role = authUser?.role ?? null;
    const status = authUser?.company?.status?.trim() ?? null;
    const userStatus = authUser?.status?.trim() ?? null;

    // Check if we should fetch dashboard data
    const shouldFetchDashboardData = role === "admin" && status === "فعالة";

    // Fetch trips data
    const { data: tripsData, isLoading: tripsLoading, error: tripsError } = useQuery({
        queryKey: ['dashboard-trips'],
        queryFn: () => getTrips("الكل"),
        staleTime: 5 * 60 * 1000,
        enabled: shouldFetchDashboardData,
    });

    // Fetch earnings data
    const { data: earningsData, isLoading: earningsLoading } = useQuery({
        queryKey: ['earnings-this-year'],
        queryFn: getEarningsThisYear,
        staleTime: 5 * 60 * 1000,
        enabled: shouldFetchDashboardData,
    });

    // Fetch ratings data
    const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
        queryKey: ['ratings-this-year'],
        queryFn: getRatingsThisYear,
        staleTime: 5 * 60 * 1000,
        enabled: shouldFetchDashboardData,
    });

    // React Query mutation for createCompany
    const { mutate: addCompany, isPending } = useMutation({
        mutationFn: createCompany,
        onSuccess: (data) => {
            toast.success("تم إرسال طلب الشركة بنجاح ✅");
            setShowCompanyDialog(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "فشل في إنشاء الشركة ❌");
        },
    });

    const handleFilterChange = useCallback((filterLabel) => {
        const selectedOption = filterOptions.find((opt) => opt.label === filterLabel);
        if (selectedOption) setCurrentFilter(selectedOption.label);
    }, []);

    // Prepare chart data
    const earningsChartData = useMemo(() => {
        if (!earningsData?.monthlyEarnings) return { labels: [], values: [] };

        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

        return {
            labels: months,
            values: earningsData.monthlyEarnings
        };
    }, [earningsData]);

    const ratingsChartData = useMemo(() => {
        if (!ratingsData?.monthlyRatings) return { labels: [], values: [] };

        const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
            "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

        return {
            labels: months,
            values: ratingsData.monthlyRatings
        };
    }, [ratingsData]);

    // Normalize trips data for table
    const tableData = useMemo(() => {
        if (!tripsData?.trips) return [];

        return tripsData.trips.map(trip => ({
            id: trip.id,
            name: trip.name,
            start_date: trip.start_date,
            days: trip.days,
            tickets: trip.tickets,
            price: trip.price,
            status: trip.status,
            companyName: trip.company?.name || "غير محدد",
            categories: trip.tags || [],
        }));
    }, [tripsData]);

    // Memoized filtered data
    const filteredData = useMemo(() => {
        let newData = [...tableData];
        const selectedOption = filterOptions.find((opt) => opt.label === currentFilter);

        switch (selectedOption?.value) {
            case "latest":
                newData.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
                break;
            case "oldest":
                newData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
                break;
            case "highest":
                newData.sort((a, b) => b.tickets - a.tickets);
                break;
            case "lowest":
                newData.sort((a, b) => a.tickets - b.tickets);
                break;
            default:
                newData.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        }
        return newData;
    }, [currentFilter, tableData]);

    const handleAddCompany = (formData) => {
        const { email, ...dataWithoutEmail } = formData;
        addCompany(dataWithoutEmail);
    };

    // Loading state for entire dashboard
    const isLoadingDashboard = shouldFetchDashboardData &&
        (tripsLoading || earningsLoading || ratingsLoading);

    if (isLoadingDashboard) {
        return <PageSkeleton rows={8} />;
    }

    // Error state for trips
    if (tripsError && role === "admin" && status === "فعالة") {
        return (
            <div className="text-red-500 text-center py-8">
                خطأ في تحميل بيانات الرحلات
            </div>
        );
    }

    // Case 1: no role
    if (!role) {
        return (
            <>
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={NoAccessImage}
                        alt="No access"
                        className="w-60 h-60 sm:w-[22rem] sm:h-[22rem] object-contain"
                    />
                    <p className="text-lg text-red-600 my-4">
                        قدّم طلب شركتك لكي تساهم في تعزيز السياحة في سوريا
                    </p>
                    <button
                        onClick={() => setShowCompanyDialog(true)}
                        disabled={isPending}
                        className="bg-green text-white min-w-[250px] py-4 px-6 rounded-lg hover:shadow-md cursor-pointer transition text-lg flex items-center justify-center gap-2"
                    >
                        {isPending ? "جاري الإرسال..." : "قدم طلب"}
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <CompanyDialog
                    open={showCompanyDialog}
                    onClose={() => setShowCompanyDialog(false)}
                    mode="create"
                    onAdd={handleAddCompany}
                    isLoading={isPending}
                />
            </>
        );
    }

    // Case 2: rejected user status
    if (userStatus === "reject") {
        return (
            <>
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={NoAccessImage}
                        alt="Rejected"
                        className="w-60 h-60 sm:w-[16rem] sm:h-[20rem] object-contain"
                    />
                    <p className="text-lg text-red-600 my-4">
                        تم رفض طلبك يرجى تعديل المتطلبات والمحاولة لاحقا
                    </p>
                    <button
                        onClick={() => setShowCompanyDialog(true)}
                        disabled={isPending}
                        className="bg-green text-white min-w-[250px] py-4 px-6 rounded-lg hover:shadow-md cursor-pointer transition text-lg flex items-center justify-center gap-2 mt-4"
                    >
                        {isPending ? "جاري الإرسال..." : "إعادة التقديم"}
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <CompanyDialog
                    open={showCompanyDialog}
                    onClose={() => setShowCompanyDialog(false)}
                    mode="create"
                    onAdd={handleAddCompany}
                    isLoading={isPending}
                />
            </>
        );
    }

    // Case 3: admin pending
    if (role === "admin" && status === "في الانتظار") {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-gray-700">
                <img src={PendingIcon} alt="Pending" className="w-32 h-32" />
                <h2 className="text-2xl sm:text-3xl font-bold">طلبك قيد المراجعة</h2>
            </div>
        );
    }

    // Case 4: admin active
    if (role === "admin" && status === "فعالة") {
        return (
            <div className="flex w-full flex-col gap-6">
                {/* Charts Section - Stacked vertically */}
                <div className="flex flex-col gap-6">
                    {/* Earnings Chart */}
                    <div>
                        <h1 className="text-h1-bold-24 mb-4 text-gray-900">الأرباح</h1>
                        {earningsLoading ? (
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
                            </div>
                        ) : (
                            <LineChart
                                labels={earningsChartData.labels}
                                values={earningsChartData.values}
                                label={"الأرباح"}
                                tooltip_text={"الأرباح"}
                            />
                        )}
                    </div>

                    {/* Ratings Chart */}
                    <div>
                        <h1 className="text-h1-bold-24 mb-4 text-gray-900">التقييمات</h1>
                        {ratingsLoading ? (
                            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green"></div>
                            </div>
                        ) : (
                            <LineChart
                                labels={ratingsChartData.labels}
                                values={ratingsChartData.values}
                                label={"التقييمات"}
                                color={"#d1a347"}
                                tooltip_text={"التقييمات"}
                            />
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <h2 className="text-h1-bold-24 text-gray-800">الرحلات</h2>
                        <SortFilterButton
                            options={filterOptions.map((opt) => opt.label)}
                            selectedValue={currentFilter}
                            position="left"
                            onChange={handleFilterChange}
                        />
                    </div>
                    <Table
                        columns={columns}
                        data={filteredData}
                        showFilter={false}
                        showHeader={false}
                        showSeeAll={true}
                        basePath={"trips"}
                        entityType={"company"}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default DashboardOverview;