// pages/Companies.jsx
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RequestsList from "@/components/common/RequestsList";
import AddCompanyInstructions from "@/components/panels/AddCompanyInstructions";
import CompanyDialog from "@/components/dialog/CompanyDialog";
import Chart from "@/components/common/Chart.jsx";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createCompanyByAdmin, getCompaniesOnHold, getAllCompanies } from "@/services/companies/companiesApi";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export default function Companies() {
    const queryClient = useQueryClient();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState("trips");
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [minimumLoading, setMinimumLoading] = useState(true);
    const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);

    // Set a timer to ensure skeleton shows for at least 0.5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinimumLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Query for fetching all companies
    const {
        data: allCompaniesData = {},
        isLoading: isLoadingAllCompanies,
        isError: isErrorAllCompanies,
        isFetching: isFetchingAllCompanies
    } = useQuery({
        queryKey: ['allCompanies'],
        queryFn: getAllCompanies,
        staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Cache for 10 minutes
    });

    const companies = allCompaniesData.companies || [];

    // Query for fetching companies on hold
    const {
        data: companiesOnHold = [],
        isLoading: isLoadingRequests,
        refetch: refetchCompanies,
        isFetching: isFetchingCompaniesOnHold
    } = useQuery({
        queryKey: ['companiesOnHold'],
        queryFn: getCompaniesOnHold,
        staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
        cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    // Track when initial data has loaded
    useEffect(() => {
        if (!isLoadingAllCompanies && !isLoadingRequests && !hasInitialDataLoaded) {
            setHasInitialDataLoaded(true);
        }
    }, [isLoadingAllCompanies, isLoadingRequests, hasInitialDataLoaded]);

    // Mutation for creating a company
    const createCompanyMutation = useMutation({
        mutationFn: createCompanyByAdmin,
        onSuccess: () => {
            // Invalidate and refetch companies queries
            queryClient.invalidateQueries(['allCompanies']);
            queryClient.invalidateQueries(['companiesOnHold']);
            toast.success("تم إنشاء الشركة بنجاح");
            setCreateDialogOpen(false);
        },
        onError: (error) => {
            toast.error("فشل في إنشاء الشركة: " + (error.response?.data?.message || error.message));
        }
    });

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
        setSelectedRequest(null);
    };

    const handleAccept = (data) => {
        console.log("Accepted:", data);
        // Here you would typically call an API to approve the company
        toast.success("تم قبول الشركة بنجاح");
        handleCloseViewDialog();
        refetchCompanies(); // Refresh the list after approval
        queryClient.invalidateQueries(['allCompanies']); // Refresh all companies data
    };

    const handleDecline = (data) => {
        console.log("Declined:", data);
        // Here you would typically call an API to reject the company
        toast.success("تم رفض الشركة بنجاح");
        handleCloseViewDialog();
        refetchCompanies(); // Refresh the list after rejection
        queryClient.invalidateQueries(['allCompanies']); // Refresh all companies data
    };

    const handleAddCompany = (newCompany) => {
        createCompanyMutation.mutate(newCompany);
    };

    const handleStatChange = (value) => {
        setSelectedStat(value);
    };

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

    // Prepare chart data from API response - limited to 10 companies
    const chartData = useMemo(() => {
        if (!companies || companies.length === 0) {
            return {
                trips: { labels: [], values: [] },
                ratings: { labels: [], values: [] }
            };
        }

        // Sort companies by number of trips (descending) and take top 10
        const topCompaniesByTrips = [...companies]
            .sort((a, b) => b.number_of_trips - a.number_of_trips)
            .slice(0, 10);

        // Sort companies by rating (descending) and take top 10
        const topCompaniesByRating = [...companies]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 10);

        return {
            trips: {
                labels: topCompaniesByTrips.map(company => company.name_of_company),
                values: topCompaniesByTrips.map(company => company.number_of_trips)
            },
            ratings: {
                labels: topCompaniesByRating.map(company => company.name_of_company),
                values: topCompaniesByRating.map(company => company.rating)
            }
        };
    }, [companies]);

    // Filter options for the SortFilterButton
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب الاسم (أ-ي)", value: "name_asc" },
        { label: "حسب الاسم (ي-أ)", value: "name_desc" },
        { label: "حسب الرحلات (مرتفع)", value: "trips_desc" },
        { label: "حسب الرحلات (منخفض)", value: "trips_asc" },
        { label: "حسب التقييم (مرتفع)", value: "rating_desc" },
        { label: "حسب التقييم (منخفض)", value: "rating_asc" },
        { label: "حسب الحالة (نشط)", value: "نشط" },
        { label: "حسب الحالة (حظر مؤقت)", value: "حظر مؤقت" },
        { label: "حسب الحالة (حظر دائم)", value: "حظر دائم" },
    ];

    // Prepare table data from API response
    const tableData = useMemo(() => {
        if (!companies || companies.length === 0) {
            return [];
        }

        return companies.map(company => ({
            id: company.id,
            image: company.image,
            company: company.name_of_company,
            trips: company.number_of_trips,
            rating: company.rating,
            status: company.status,
            // Include the full company data for potential use in actions
            originalData: company
        }));
    }, [companies]);

    // Filter and sort the table data based on the current filter
    const filteredData = useMemo(() => {
        let newData = [...tableData];

        switch (currentFilter) {
            case "name_asc":
                newData.sort((a, b) => a.company.localeCompare(b.company));
                break;
            case "name_desc":
                newData.sort((a, b) => b.company.localeCompare(a.company));
                break;
            case "trips_desc":
                newData.sort((a, b) => b.trips - a.trips);
                break;
            case "trips_asc":
                newData.sort((a, b) => a.trips - b.trips);
                break;
            case "rating_desc":
                newData.sort((a, b) => b.rating - a.rating);
                break;
            case "rating_asc":
                newData.sort((a, b) => a.rating - b.rating);
                break;
            case "نشط":
            case "حظر مؤقت":
            case "حظر دائم":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                // "الكل" - no filtering needed
                break;
        }

        return newData;
    }, [tableData, currentFilter]);

    // Columns configuration for the CommonTable
    const tableColumns = [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم الشركة", accessor: "company" },
        { header: "عدد الرحلات", accessor: "trips" },
        { header: "التقييم", accessor: "rating" },
        { header: "الحالة", accessor: "status" }
    ];

    // Show skeleton only during initial load or when minimum loading time hasn't passed
    const showSkeleton = (!hasInitialDataLoaded && minimumLoading) ||
        (isLoadingAllCompanies && !companies.length) ||
        (isLoadingRequests && !companiesOnHold.length);

    // Loading state skeleton
    if (showSkeleton) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 4,
                }}
            >
                {/* Skeleton for the main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-screen" dir="rtl">
                    {/* Main Panel (Left Side) */}
                    <div className="lg:col-span-2">
                        <Skeleton variant="rectangular" width="60%" height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
                    </div>

                    {/* Sidebar with Requests List (Right Side) */}
                    <div className="lg:col-span-1">
                        <Skeleton variant="rectangular" width="60%" height={40} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
                    </div>
                </div>

                {/* Skeleton for Chart Section */}
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2, mt: 4 }} />

                {/* Skeleton for Table Section */}
                <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2, mt: 4 }} />
            </Box>
        );
    }

    if (isErrorAllCompanies) return <p className="p-4 text-red-600 font-semibold">فشل تحميل البيانات. يرجى المحاولة لاحقاً.</p>;

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-screen" dir="rtl">
                {/* Main Panel (Left Side) */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-2">إضافة شركة</h2>
                    <AddCompanyInstructions
                        onAddClick={() => setCreateDialogOpen(true)}
                        isLoading={createCompanyMutation.isPending}
                    />
                </div>

                {/* Sidebar with Requests List (Right Side) */}
                <div className="lg:col-span-1">
                    {/* Title added here, outside the component card */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-2">قائمة الطلبات</h2>
                    <RequestsList
                        requests={companiesOnHold}
                        selectedRequest={selectedRequest}
                        onSelectRequest={handleSelectRequest}
                        isLoading={isLoadingRequests && !companiesOnHold.length}
                    />
                </div>
            </div>

            {/* Chart Section */}
            <div className="mt-8">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-6 items-center text-gray-800 px-2 justify-between">
                        <div>
                            <h1 className="text-h1-bold-24">أفضل الشركات</h1>
                        </div>

                        <div className="flex gap-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="trips"
                                    checked={selectedStat === "trips"}
                                    onChange={(e) => handleStatChange(e.target.value)}
                                    className="accent-green cursor-pointer"
                                />
                                <span className="text-body-regular-16-auto">عدد الرحلات</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="ratings"
                                    checked={selectedStat === "ratings"}
                                    onChange={(e) => handleStatChange(e.target.value)}
                                    className="accent-green cursor-pointer"
                                />
                                <span className="text-body-regular-16-auto">التقييمات</span>
                            </label>
                        </div>
                    </div>

                    <div className="p-8 bg-white rounded-lg shadow relative min-h-[24rem]">
                        <div className="flex flex-col">
                            <div className="flex gap-2 text-h2-bold-16 mb-4">
                                <h1>{selectedStat === "trips" ? "عدد الرحلات" : "التقييمات"}</h1>
                                <div className="bg-green w-8 h-5 rounded-lg"></div>
                            </div>

                            {isLoadingAllCompanies && !companies.length ? (
                                <Skeleton variant="rectangular" width="100%" height={300} />
                            ) : (
                                <Chart
                                    labels={selectedStat === "trips" ? chartData.trips.labels : chartData.ratings.labels}
                                    values={selectedStat === "trips" ? chartData.trips.values : chartData.ratings.values}
                                    label={selectedStat === "trips" ? "عدد الرحلات" : "التقييمات"}
                                    height="20rem"
                                    className="h-full w-full"
                                    style={{ height: "100%" }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CommonTable Section with SortFilterButton */}
            <div className="mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
                    <h1 className="text-h1-bold-24 text-gray-800">الشركات العاملة</h1>
                    <SortFilterButton
                        options={filterOptions.map((opt) => opt.label)}
                        selectedValue={currentFilter === "الكل" ? "الكل" :
                            filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                        position="left"
                        onChange={(label) => {
                            const matched = filterOptions.find((f) => f.label === label);
                            if (matched) handleFilterChange(matched.value);
                        }}
                    />
                </div>

                {isLoadingAllCompanies && !companies.length ? (
                    <div className="flex flex-col gap-2">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rectangular"
                                width="100%"
                                height={50}
                                sx={{ mb: 1, borderRadius: 1 }}
                            />
                        ))}
                    </div>
                ) : (
                    <CommonTable
                        columns={tableColumns}
                        data={filteredData}
                        basePath="companies"
                    />
                )}
            </div>

            {/* Dialogs */}
            <CompanyDialog
                open={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                mode="create"
                onAdd={handleAddCompany}
                isLoading={createCompanyMutation.isPending}
            />
            {selectedRequest && (
                <CompanyDialog
                    open={isViewDialogOpen}
                    onClose={handleCloseViewDialog}
                    mode="view"
                    initialData={selectedRequest}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                />
            )}
            <ToastContainer position="bottom-left" />
        </>
    );
}