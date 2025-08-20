// pages/Companies.jsx
import React, { useState, useCallback, useMemo } from "react";
import RequestsList from "@/components/common/RequestsList";
import AddCompanyInstructions from "@/components/panels/AddCompanyInstructions";
import CompanyDialog from "@/components/dialog/CompanyDialog";
import Chart from "@/components/common/Chart.jsx";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton"; // Import the SortFilterButton
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { companiesData, sampleRequests } from "@/data/companies.js";

export default function Companies() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedStat, setSelectedStat] = useState("trips");
    const [currentFilter, setCurrentFilter] = useState("الكل");

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
        handleCloseViewDialog();
    };

    const handleDecline = (data) => {
        console.log("Declined:", data);
        handleCloseViewDialog();
    };

    const handleAddCompany = (newCompany) => {
        console.log("New Company Added via Dialog:", newCompany);
        setCreateDialogOpen(false);
    };

    const handleStatChange = (value) => {
        setSelectedStat(value);
    };

    const handleFilterChange = useCallback((filterValue) => {
        setCurrentFilter(filterValue);
    }, []);

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

    // Sample data for trips and ratings
    const tripsData = {
        labels: ["شركة النقل", "شركة السياحة", "شركة المستقبل", "شركة البناء", "شركة التقنية"],
        values: [45, 32, 28, 22, 18]
    };

    const ratingsData = {
        labels: ["شركة المستقبل", "شركة التقنية", "شركة البناء", "شركة النقل", "شركة السياحة"],
        values: [4.8, 4.6, 4.3, 4.1, 3.9]
    };

    const chartData = selectedStat === "trips" ? tripsData : ratingsData;

    // Sample data for the CommonTable
    const tableData = [
        { id: 1, company: "شركة النقل", trips: 45, rating: 4.1, status: "نشط" },
        { id: 2, company: "شركة السياحة", trips: 32, rating: 3.9, status: "نشط" },
        { id: 3, company: "شركة المستقبل", trips: 28, rating: 4.8, status: "في الانتظار" },
        { id: 4, company: "شركة البناء", trips: 22, rating: 4.3, status: "مقبول" },
        { id: 5, company: "شركة التقنية", trips: 18, rating: 4.6, status: "مرفوض" },
        { id: 6, company: "شركة الغذاء", trips: 15, rating: 4.0, status: "حظر مؤقت" },
        { id: 7, company: "شركة الاتصالات", trips: 12, rating: 4.2, status: "قيد الحذف" }
    ];

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

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 min-h-screen" dir="rtl">
                {/* Main Panel (Left Side) */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-2">إضافة شركة</h2>
                    <AddCompanyInstructions onAddClick={() => setCreateDialogOpen(true)} />
                </div>

                {/* Sidebar with Requests List (Right Side) */}
                <div className="lg:col-span-1">
                    {/* Title added here, outside the component card */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-2">قائمة الطلبات</h2>
                    <RequestsList
                        requests={sampleRequests}
                        selectedRequest={selectedRequest}
                        onSelectRequest={handleSelectRequest}
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

                            <Chart
                                labels={chartData.labels}
                                values={chartData.values}
                                label={selectedStat === "trips" ? "عدد الرحلات" : "التقييمات"}
                                height="20rem"
                                className="h-full w-full"
                                style={{ height: "100%" }}
                            />
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

                <CommonTable
                    columns={tableColumns}
                    data={filteredData}
                    basePath="companies"
                />
            </div>

            {/* Dialogs */}
            <CompanyDialog
                open={isCreateDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                mode="create"
                onAdd={handleAddCompany}
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