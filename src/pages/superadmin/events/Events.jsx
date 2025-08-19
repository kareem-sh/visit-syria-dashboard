import React, { useState, useCallback } from "react";
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Banner from "@/components/common/Banner.jsx";
import EventIcon from "@/assets/images/event image.svg";
import EventForm from "@/components/dialog/EventForm.jsx";
import { getEvents } from "@/services/events/eventsApi.js";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useQuery } from "@tanstack/react-query";

const columns = [
    { header: "الرقم التعريفي", accessor: "id" },
    { header: "اسم الحدث", accessor: "eventName" },
    { header: "التاريخ", accessor: "date" },
    { header: "المدة", accessor: "duration" },
    { header: "المكان", accessor: "location" },
    { header: "عدد التذاكر", accessor: "tickets_count" },
    { header: "سعر التذكرة", accessor: "ticket_price" },
    { header: "الحالة", accessor: "status" },
];

const filterOptions = [
    { label: "الكل", value: "الكل" },
    { label: "حسب التاريخ (الأقدم)", value: "oldest" },
    { label: "حسب التاريخ (الأحدث)", value: "latest" },
    { label: "حسب الحالة (منتهية)", value: "منتهية" },
    { label: "حسب الحالة (تم الإلغاء)", value: "تم الإلغاء" },
    { label: "حسب الحالة (جارية الآن)", value: "جارية حالياً" },
    { label: "حسب الحالة (لم تبدأ بعد)", value: "لم تبدأ بعد" },
];

const Events = () => {
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: events = [], isLoading, isError } = useQuery({
        queryKey: ["events"],
        queryFn: getEvents,
    });

    const handleFilterChange = useCallback(
        (filterValue) => {
            setCurrentFilter(filterValue);
        },
        []
    );

    const filteredData = React.useMemo(() => {
        let newData = [...events];

        switch (currentFilter) {
            case "latest":
                newData.sort(
                    (a, b) =>
                        new Date(b.date.split("/").reverse().join("-")) -
                        new Date(a.date.split("/").reverse().join("-"))
                );
                break;
            case "oldest":
                newData.sort(
                    (a, b) =>
                        new Date(a.date.split("/").reverse().join("-")) -
                        new Date(b.date.split("/").reverse().join("-"))
                );
                break;
            case "منتهية":
            case "تم الإلغاء":
            case "جارية حالياً":
            case "لم تبدأ بعد":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            default:
                newData = [...events];
        }

        return newData;
    }, [events, currentFilter]);

    if (isLoading)
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
                <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="200px" height={40} sx={{ mb: 2 }} />
                {[...Array(6)].map((_, i) => (
                    <Skeleton
                        key={i}
                        variant="rectangular"
                        width="100%"
                        height={50}
                        sx={{ mb: 1, borderRadius: 1 }}
                    />
                ))}
            </Box>
        );

    if (isError) return <p className="p-4 text-red-600 font-semibold">فشل تحميل البيانات. يرجى المحاولة لاحقاً.</p>;

    return (
        <div className="w-full p-0 m-0">
            {/* Banner */}
            <Banner
                title="إضافة حدث"
                description="يرجى إدخال بيانات الفعالية الجديدة لإدراجها ضمن الأنشطة المعتمدة من وزارة السياحة"
                icon={EventIcon}
                onButtonClick={() => setIsDialogOpen(true)}
            />

            {/* Dialog */}
            {isDialogOpen && <EventForm onClose={() => setIsDialogOpen(false)} />}

            {/* Title & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2 mt-4">
                <h1 className="text-h1-bold-24 text-gray-800">الأحداث</h1>
                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) handleFilterChange(matched.value);
                    }}
                />
            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredData}
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                showFilter={false}
                showHeader={false}
                showSeeAll={false}
                basePath={"events"}
            />
        </div>
    );
};

export default Events;
