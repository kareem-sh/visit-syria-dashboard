import React, { useState, useMemo, useCallback } from 'react';
import LineChart from "@/components/common/LineChart.jsx";
import Table from "@/components/common/CommonTable.jsx";
import SortFilterButton from "@/components/common/SortFilterButton.jsx";

// 1. Updated columns to match the "الرحلات" (Trips) table in the image
const columns = [
    { header: "الرقم التعريفي", accessor: "id" },
    { header: "اسم الرحلة", accessor: "tripName" },
    { header: "التاريخ", accessor: "date" },
    { header: "المدة", accessor: "duration" },
    { header: "عدد التذاكر", accessor: "ticketsCount" },
    { header: "سعر التذكرة", accessor: "ticketPrice" },
    {header: "الحالة", accessor: "status",},
];

// 2. Define filter options for the SortFilterButton
const filterOptions = [
    { label: "الأحدث", value: "latest" },
    { label: "الأقدم", value: "oldest" },
    { label: "الأعلى تقييماً", value: "highest" },
    { label: "الأدنى تقييماً", value: "lowest" },
];

// 3. Updated dummy data to match the "الرحلات" (Trips) table in the image
const DUMMY_TRIPS_DATA = [
    { id: '5765', tripName: 'رحلة في حماية', date: '25/06/2025', duration: '3 أيام', ticketsCount: 55, ticketPrice: '100$', status: 'لم تبدأ بعد' },
    { id: '3405834', tripName: 'رحلة إلى سواحل ...', date: '31/08/2025', duration: '5 أيام', ticketsCount: 200, ticketPrice: '300$', status: 'منتهية' },
    { id: '54983', tripName: 'جولة في الشرق', date: '20/10/2025', duration: '5 ساعات', ticketsCount: 450, ticketPrice: '50$', status: 'جارية حالياً' },
    { id: '349834', tripName: 'رحلة إلى النور تدمر', date: '04/09/2025', duration: '4 أيام', ticketsCount: 370, ticketPrice: '120$', status: 'تم الإلغاء' },
];

const DUMMY_CHART_VALUES = [65, 59, 80, 81, 56, 55, 90, 10, 20];
const DUMMY_CHART_LABELS = ['0', '2', '4', '6', '8'];

const DashboardOverview = () => {
    const [currentFilter, setCurrentFilter] = useState("الأحدث");

    const handleFilterChange = useCallback((filterLabel) => {
        const selectedOption = filterOptions.find(opt => opt.label === filterLabel);
        if (selectedOption) {
            setCurrentFilter(selectedOption.label);
        }
    }, []);

    // 4. Memoize filtered data to avoid recalculating on every render
    const filteredData = useMemo(() => {
        let newData = [...DUMMY_TRIPS_DATA];
        const selectedOption = filterOptions.find(opt => opt.label === currentFilter);

        // Sorting logic based on the image's fields
        switch (selectedOption?.value) {
            case "latest":
                newData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case "oldest":
                newData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "highest":
                newData.sort((a, b) => b.ticketsCount - a.ticketsCount);
                break;
            case "lowest":
                newData.sort((a, b) => a.ticketsCount - b.ticketsCount);
                break;
            default:
                newData.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        return newData;
    }, [currentFilter]);

    return (
        <div className="flex w-full flex-col gap-6">

            {/* The parent container for the charts should have `flex` and `gap-4` */}
            <div className="flex gap-4">
                {/* Each chart wrapper should be `flex-1` to take up equal space */}
                <div className="flex-1">
                    <h1 className="text-h1-bold-24 mb-4 text-gray-900">الأرباح</h1>
                    <LineChart
                        labels={DUMMY_CHART_LABELS}
                        values={DUMMY_CHART_VALUES}
                    />
                </div>
                <div className="flex-1">
                    <h1 className="text-h1-bold-24 text-gray-900 mb-4">التقييمات</h1>
                    <LineChart
                        labels={DUMMY_CHART_LABELS}
                        values={DUMMY_CHART_VALUES}
                        label={"عدد التقييمات"}
                        color={"#d1a347"}
                        tooltip_text={"عدد التقييمات"}
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="w-full">
                {/* Table Header with Title and Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-h1-bold-24 text-gray-800">الرحلات</h2>
                    <SortFilterButton
                        options={filterOptions.map((opt) => opt.label)}
                        selectedValue={currentFilter}
                        position="left"
                        onChange={handleFilterChange}
                    />
                </div>

                {/* Table Component */}
                <Table
                    columns={columns}
                    data={filteredData}
                    showFilter={false}       // Managed by SortFilterButton above
                    showHeader={false}       // We have a custom header above
                    showSeeAll={true}        // Optional: link to a full ratings page
                    basePath={"ratings"}    // Example path for "See All"
                    entityType={"rating"}
                />
            </div>
        </div>
    );
};

export default DashboardOverview;