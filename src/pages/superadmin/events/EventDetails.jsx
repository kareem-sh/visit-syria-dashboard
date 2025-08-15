import React, { useState, useCallback } from "react";
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Banner from "@/components/common/Banner.jsx";
import EventIcon from "@/assets/images/event image.svg";
import { eventsData } from "@/data/event.js";
import EventForm from "@/components/common/EventForm";

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

const EventDetails = ({ data = eventsData }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleFilterChange = useCallback(
        (filterValue) => {
            setCurrentFilter(filterValue);

            let newData = [...data]; // always start from original data

            switch (filterValue) {
                case "latest":
                    newData.sort((a, b) => {
                        const dateA = new Date(a.date.split("/").reverse().join("-"));
                        const dateB = new Date(b.date.split("/").reverse().join("-"));
                        return dateB - dateA; // newest first
                    });
                    break;

                case "oldest":
                    newData.sort((a, b) => {
                        const dateA = new Date(a.date.split("/").reverse().join("-"));
                        const dateB = new Date(b.date.split("/").reverse().join("-"));
                        return dateA - dateB; // oldest first
                    });
                    break;


                case "منتهية":
                case "تم الإلغاء":
                case "جارية حالياً":
                case "لم تبدأ بعد":
                    newData = newData.filter((item) => item.status === filterValue);
                    break;

                default:
                    newData = [...data];
            }

            setFilteredData(newData);
        },
        [data]
    );

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
                basePath={"event"}
            />
        </div>
    );
};

export default EventDetails;
