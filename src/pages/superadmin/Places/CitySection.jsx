import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import {
    getRestaurantsByCity,
    getHotelsByCity,
    getTouristPlacesByCity
} from "@/services/places/placesApi";
import { useQuery } from "@tanstack/react-query";
import { PageSkeleton } from "@/components/common/PageSkeleton";

// Column definitions
const sectionColumns = {
    restaurants: [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم المطعم", accessor: "name" },
        { header: "عدد الأفرع", accessor: "branches" },
        { header: "التقييم", accessor: "rating" },
    ],
    hotels: [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم الفندق", accessor: "name" },
        { header: "عدد الأفرع", accessor: "branches" },
        { header: "التقييم", accessor: "rating" },
    ],
    tourists: [
        { header: "الرقم التعريفي", accessor: "id" },
        { header: "اسم الموقع", accessor: "name" },
        { header: "النوع", accessor: "type" },
        { header: "التقييم", accessor: "rating" },
    ],
};

const filterOptions = [
    { label: "الكل", value: "الكل" },
    { label: "الأعلى تقييماً", value: "best" },
    { label: "الأقل تقييماً", value: "worst" },
];

export default function CitySection() {
    const { cityname, section } = useParams();
    const navigate = useNavigate();
    const city = cityname ? decodeURIComponent(cityname) : "";

    const [filteredData, setFilteredData] = useState([]);
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // Determine which API function to call
    const getApiFunction = () => {
        switch (section) {
            case "restaurants":
                return getRestaurantsByCity;
            case "hotels":
                return getHotelsByCity;
            case "tourists":
                return getTouristPlacesByCity;
            default:
                return () => Promise.resolve([]);
        }
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['citySection', city, section],
        queryFn: () => getApiFunction()(city),
    });

    // Apply filters
    useEffect(() => {
        if (!data) return;

        let newData = [...data];

        if (currentFilter === "best") {
            newData.sort((a, b) => b.rating - a.rating);
        } else if (currentFilter === "worst") {
            newData.sort((a, b) => a.rating - b.rating);
        }

        setFilteredData(newData);
    }, [data, currentFilter]);

    // Section titles
    const sectionTitles = {
        restaurants: "المطاعم",
        hotels: "الفنادق",
        tourists: "الأماكن السياحية",
    };

    if (isLoading) {
        return <PageSkeleton rows={6} />;
    }

    if (isError) {
        return (
            <div className="p-4 text-red-500">
                حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقًا.
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-4 text-gray-500">
                لا توجد بيانات متاحة لـ {sectionTitles[section]} في {city}
            </div>
        );
    }

    return (
        <div className="w-full p-0 m-0">
            {/* Title + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
                <h1 className="text-h1-bold-24 text-gray-800">
                    {sectionTitles[section]} في {city}
                </h1>

                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) setCurrentFilter(matched.value);
                    }}
                />
            </div>

            {/* Dynamic Table */}
            <Table
                columns={sectionColumns[section] || []}
                data={filteredData}
                currentFilter={currentFilter}
                onFilterChange={setCurrentFilter}
                showFilter={false}
                showHeader={true}
                showSeeAll={false}
                basePath={`places/cities/${encodeURIComponent(city)}/${section}`}
            />
        </div>
    );
}