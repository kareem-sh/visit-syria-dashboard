// Users.jsx
import React, { useState, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import Chart from "@/components/common/Chart.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { getAllUsers } from "@/services/users/usersApi";

// Define consistent query keys
export const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filters) => [...userKeys.lists(), { filters }],
    details: () => [...userKeys.all, 'detail'],
    detail: (id) => [...userKeys.details(), id],
};

export default function Users() {
    const [selectedStat, setSelectedStat] = useState("posts");
    const [currentFilter, setCurrentFilter] = useState("الكل");

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

    // Use React Query to fetch all users with consistent key
    const { data: users = [], isLoading, isError, error } = useQuery({
        queryKey: userKeys.lists(),
        queryFn: getAllUsers,
        staleTime: 5 * 60 * 1000,
    });

    // Transform API data to match the required format
    const transformedUsers = useMemo(() => {
        return users.map(user => ({
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            postsCount: user.number_of_post,
            eventsCount: user.reserved_events,
            tripsCount: user.reserved_trips,
            status: user.account_status,
            originalData: user
        }));
    }, [users]);

    const getChartData = () => {
        let dataForChart = [...transformedUsers];

        if (selectedStat === 'posts') {
            dataForChart.sort((a, b) => b.postsCount - a.postsCount);
        } else if (selectedStat === 'events') {
            dataForChart.sort((a, b) => b.eventsCount - a.eventsCount);
        } else if (selectedStat === 'trips') {
            dataForChart.sort((a, b) => b.tripsCount - a.tripsCount);
        }

        const top10 = dataForChart.slice(0, 10);

        return {
            labels: top10.map(item => item.name),
            values: top10.map(item => {
                if (selectedStat === 'posts') return item.postsCount;
                if (selectedStat === 'events') return item.eventsCount;
                if (selectedStat === 'trips') return item.tripsCount;
                return 0;
            })
        };
    };

    const chartData = getChartData();

    // Filter and sort logic
    const filteredData = useMemo(() => {
        let newData = [...transformedUsers];

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
    }, [transformedUsers, currentFilter]);

    const handleStatChange = (value) => {
        setSelectedStat(value);
    };

    // Show skeleton while loading
    if (isLoading) {
        return <PageSkeleton rows={6} />;
    }

    // Show error if needed
    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    // Table columns
    const tableColumns = [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم المستخدم", accessor: "name" },
        { header: "عدد الرحلات المحجوزة", accessor: "tripsCount" },
        { header: "عدد الأحداث المحجوزة", accessor: "eventsCount" },
        { header: "عدد المنشورات", accessor: "postsCount" },
        { header: "الحالة", accessor: "status" }
    ];

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
                            <span className="text-body-regular-14">عدد المنشورات</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="events"
                                checked={selectedStat === "events"}
                                onChange={(e) => handleStatChange(e.target.value)}
                                className="accent-green cursor-pointer"
                            />
                            <span className="text-body-regular-14">عدد الأحداث المحجوزة</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="trips"
                                checked={selectedStat === "trips"}
                                onChange={(e) => handleStatChange(e.target.value)}
                                className="accent-green cursor-pointer"
                            />
                            <span className="text-body-regular-14">عدد الرحلات المحجوزة</span>
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
                            if (matched) setCurrentFilter(matched.value);
                        }}
                    />
                </div>

                <CommonTable
                    columns={tableColumns}
                    data={filteredData}
                    basePath="users"
                    entityType='users'
                    rowData={filteredData.map(item => item.originalData)}
                />
            </div>
        </div>
    );
}