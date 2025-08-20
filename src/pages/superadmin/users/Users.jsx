import React, { useState, useCallback, useMemo } from "react";
import Chart from "@/components/common/Chart.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";

export default function Users() {
    const [selectedStat, setSelectedStat] = useState("posts");
    const [initialLoad, setInitialLoad] = useState(false);
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // Mock data for users
    const mockUsersByPosts = [
        { id: 1, name: "أحمد محمد", postsCount: 42, eventsCount: 12, tripsCount: 7, status: "نشط" },
        { id: 2, name: "فاطمة علي", postsCount: 38, eventsCount: 15, tripsCount: 5, status: "نشط" },
        { id: 3, name: "محمد حسن", postsCount: 35, eventsCount: 9, tripsCount: 8, status: "نشط" },
        { id: 4, name: "سارة خالد", postsCount: 28, eventsCount: 10, tripsCount: 4, status: "حظر مؤقت" },
        { id: 5, name: "علي إبراهيم", postsCount: 25, eventsCount: 7, tripsCount: 6, status: "نشط" },
        { id: 6, name: "لينا عبدالله", postsCount: 22, eventsCount: 8, tripsCount: 3, status: "نشط" },
        { id: 7, name: "يوسف أحمد", postsCount: 19, eventsCount: 5, tripsCount: 5, status: "حظر نهائي" },
        { id: 8, name: "نورا سعيد", postsCount: 17, eventsCount: 6, tripsCount: 3, status: "نشط" },
        { id: 9, name: "حسن محمود", postsCount: 15, eventsCount: 4, tripsCount: 4, status: "حظر مؤقت" },
        { id: 10, name: "ريم كمال", postsCount: 12, eventsCount: 3, tripsCount: 2, status: "نشط" }
    ];

    const mockUsersByEvents = [
        { id: 1, name: "فاطمة علي", eventsCount: 15, postsCount: 38, tripsCount: 5, status: "نشط" },
        { id: 2, name: "أحمد محمد", eventsCount: 12, postsCount: 42, tripsCount: 7, status: "نشط" },
        { id: 3, name: "سارة خالد", eventsCount: 10, postsCount: 28, tripsCount: 4, status: "حظر مؤقت" },
        { id: 4, name: "محمد حسن", eventsCount: 9, postsCount: 35, tripsCount: 8, status: "نشط" },
        { id: 5, name: "لينا عبدالله", eventsCount: 8, postsCount: 22, tripsCount: 3, status: "نشط" },
        { id: 6, name: "علي إبراهيم", eventsCount: 7, postsCount: 25, tripsCount: 6, status: "نشط" },
        { id: 7, name: "نورا سعيد", eventsCount: 6, postsCount: 17, tripsCount: 3, status: "نشط" },
        { id: 8, name: "يوسف أحمد", eventsCount: 5, postsCount: 19, tripsCount: 5, status: "حظر نهائي" },
        { id: 9, name: "حسن محمود", eventsCount: 4, postsCount: 15, tripsCount: 4, status: "حظر مؤقت" },
        { id: 10, name: "ريم كمال", eventsCount: 3, postsCount: 12, tripsCount: 2, status: "نشط" }
    ];

    const mockUsersByTrips = [
        { id: 1, name: "محمد حسن", tripsCount: 8, postsCount: 35, eventsCount: 9, status: "نشط" },
        { id: 2, name: "أحمد محمد", tripsCount: 7, postsCount: 42, eventsCount: 12, status: "نشط" },
        { id: 3, name: "علي إبراهيم", tripsCount: 6, postsCount: 25, eventsCount: 7, status: "نشط" },
        { id: 4, name: "فاطمة علي", tripsCount: 5, postsCount: 38, eventsCount: 15, status: "نشط" },
        { id: 5, name: "يوسف أحمد", tripsCount: 5, postsCount: 19, eventsCount: 5, status: "حظر نهائي" },
        { id: 6, name: "سارة خالد", tripsCount: 4, postsCount: 28, eventsCount: 10, status: "حظر مؤقت" },
        { id: 7, name: "حسن محمود", tripsCount: 4, postsCount: 15, eventsCount: 4, status: "حظر مؤقت" },
        { id: 8, name: "لينا عبدالله", tripsCount: 3, postsCount: 22, eventsCount: 8, status: "نشط" },
        { id: 9, name: "نورا سعيد", tripsCount: 3, postsCount: 17, eventsCount: 6, status: "نشط" },
        { id: 10, name: "ريم كمال", tripsCount: 2, postsCount: 12, eventsCount: 3, status: "نشط" }
    ];

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
        { label: "حسب عدد المنشورات (مرتفع)", value: "posts_desc" },
        { label: "حسب عدد المنشورات (منخفض)", value: "posts_asc" },
        { label: "حسب عدد الأحداث (مرتفع)", value: "events_desc" },
        { label: "حسب عدد الأحداث (منخفض)", value: "events_asc" },
        { label: "حسب عدد الرحلات (مرتفع)", value: "trips_desc" },
        { label: "حسب عدد الرحلات (منخفض)", value: "trips_asc" },
        { label: "حسب الحالة (نشط)", value: "نشط" },
        { label: "حسب الحالة (حظر مؤقت)", value: "حظر مؤقت" },
        { label: "حسب الحالة (حظر نهائي)", value: "حظر نهائي" },
    ];

    const getChartData = () => {
        if (selectedStat === 'posts') {
            return {
                labels: mockUsersByPosts.map(item => item.name),
                values: mockUsersByPosts.map(item => item.postsCount)
            };
        }
        if (selectedStat === 'events') {
            return {
                labels: mockUsersByEvents.map(item => item.name),
                values: mockUsersByEvents.map(item => item.eventsCount)
            };
        }
        if (selectedStat === 'trips') {
            return {
                labels: mockUsersByTrips.map(item => item.name),
                values: mockUsersByTrips.map(item => item.tripsCount)
            };
        }
        return { labels: [], values: [] };
    };

    const chartData = getChartData();

    // Sample data for the CommonTable (using posts data as base)
    const tableData = mockUsersByPosts;

    // Filter and sort the table data based on the current filter
    const filteredData = useMemo(() => {
        let newData = [...tableData];

        switch (currentFilter) {
            case "name_asc":
                newData.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name_desc":
                newData.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "posts_desc":
                newData.sort((a, b) => b.postsCount - a.postsCount);
                break;
            case "posts_asc":
                newData.sort((a, b) => a.postsCount - b.postsCount);
                break;
            case "events_desc":
                newData.sort((a, b) => b.eventsCount - a.eventsCount);
                break;
            case "events_asc":
                newData.sort((a, b) => a.eventsCount - b.eventsCount);
                break;
            case "trips_desc":
                newData.sort((a, b) => b.tripsCount - a.tripsCount);
                break;
            case "trips_asc":
                newData.sort((a, b) => a.tripsCount - b.tripsCount);
                break;
            case "نشط":
            case "حظر مؤقت":
            case "حظر نهائي":
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
        { header: "اسم المستخدم", accessor: "name" },
        { header: "عدد الرحلات المحجوزة", accessor: "tripsCount" },
        { header: "عدد الأحداث المحجوزة", accessor: "eventsCount" },
        { header: "عدد المنشورات", accessor: "postsCount" },
        { header: "الحالة", accessor: "status" }
    ];

    // Show skeleton only on initial load (disabled for mock data)
    if (initialLoad) {
        return <PageSkeleton rows={6} />;
    }

    return (
        <div className="flex flex-col gap-8 pt-2">
            {/* Chart Section */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-6 items-center text-gray-800 px-2 justify-between">
                    <div>
                        <h1 className="text-h1-bold-24">أنشط المستخدمين</h1>
                    </div>

                    <div className="flex gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="posts"
                                checked={selectedStat === "posts"}
                                onChange={(e) => handleStatChange(e.target.value)}
                                className="accent-green cursor-pointer"
                            />
                            <span className="text-body-regular-16-auto">عدد المنشورات</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="events"
                                checked={selectedStat === "events"}
                                onChange={(e) => handleStatChange(e.target.value)}
                                className="accent-green cursor-pointer"
                            />
                            <span className="text-body-regular-16-auto">عدد الأحداث المحجوزة</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="trips"
                                checked={selectedStat === "trips"}
                                onChange={(e) => handleStatChange(e.target.value)}
                                className="accent-green cursor-pointer"
                            />
                            <span className="text-body-regular-16-auto">عدد الرحلات المحجوزة</span>
                        </label>
                    </div>
                </div>

                <div className="p-8 bg-white rounded-lg shadow relative min-h-[24rem]">
                    <div className="flex flex-col">
                        <div className="flex gap-2 text-h2-bold-16 mb-4">
                            <h1>{selectedStat === "posts" ? "عدد المنشورات" : selectedStat === "events" ? "عدد الأحداث المحجوزة" : "عدد الرحلات المحجوزة" }</h1>
                            <div className="bg-green w-8 h-5 rounded-lg"></div>
                        </div>

                        <Chart
                            labels={chartData.labels}
                            values={chartData.values}
                            label={selectedStat === "posts" ? "عدد المنشورات" : selectedStat === "events" ? "عدد الأحداث المحجوزة" : "عدد الرحلات المحجوزة" }
                            height="26rem"
                            className="h-full w-full"
                            style={{ height: "100%" }}
                        />
                    </div>
                </div>
            </div>

            {/* CommonTable Section with SortFilterButton */}
            <div className="mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
                    <h1 className="text-h1-bold-24 text-gray-800">المستخدمين</h1>
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
                    basePath="users"
                    entityType='users'
                />
            </div>
        </div>
    );
}