// components/Trips.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from '@tanstack/react-query';
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { getTrips } from "@/services/trips/trips";

const columns = [
  { header: "الرقم التعريفي", accessor: "id" },
  { header: "اسم الرحلة", accessor: "name" },
  { header: "اسم الشركة", accessor: "companyName" },
  { header: "التاريخ", accessor: "start_date" },
  { header: "المدة", accessor: "days" },
  { header: "عدد التذاكر", accessor: "tickets" },
  { header: "سعر التذكرة", accessor: "price" },
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

// Fixed categories as you provided
const displayCategories = [
  "الكل",
  "تاريخية",
  "ثقافية",
  "ترفيهية",
  "دينية",
  "طبيعية",
  "أثرية",
  "طعام",
  "عادات وتقاليد"
];

// Category tag component
const CategoryTag = ({ category, isSelected = false, onClick }) => {
  return (
      <button
          onClick={() => onClick(category)}
          className={`px-3 py-1.5 rounded-full text-body-bold-14 transition-colors cursor-pointer min-w-[100px] text-center ${
              isSelected
                  ? "bg-green text-white"
                  : "border border-green text-green hover:bg-green hover:text-white"
          }`}
      >
        {category}
      </button>
  );
};

const Trips = () => {
  const { data: tripsData, isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
    staleTime: 5 * 60 * 1000,
  });

  const [currentFilter, setCurrentFilter] = useState("الكل");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  const handleFilterChange = useCallback((filterValue) => {
    setCurrentFilter(filterValue);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Prepare data for table
  const tableData = useMemo(() => {
    if (!tripsData?.trips) return [];

    return tripsData.trips.map(trip => ({
      id: trip.id,
      name: trip.name,
      companyName: trip.company?.name || "غير محدد",
      start_date: trip.start_date,
      days: trip.days,
      tickets: trip.tickets,
      price: trip.price,
      status: trip.status,
      categories: trip.tags || []
    }));
  }, [tripsData]);

  const filteredData = useMemo(() => {
    let newData = [...tableData];

    // Apply category filter based on fixed categories
    if (selectedCategory !== "الكل") {
      newData = newData.filter(trip =>
          trip.categories && trip.categories.includes(selectedCategory)
      );
    }

    // Apply status and date filters
    switch (currentFilter) {
      case "latest":
        newData.sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateB - dateA;
        });
        break;

      case "oldest":
        newData.sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateA - dateB;
        });
        break;

      case "منتهية":
      case "تم الإلغاء":
      case "جارية حالياً":
      case "لم تبدأ بعد":
        newData = newData.filter((item) => item.status === currentFilter);
        break;

      default:
        // "الكل" - no additional filtering needed
        break;
    }

    return newData;
  }, [currentFilter, selectedCategory, tableData]);

  if (isLoading) {
    return (
        <div className="w-full p-0 m-0" dir="rtl">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full p-0 m-0" dir="rtl">
          <div className="text-red-500 text-center py-8">
            خطأ في تحميل البيانات: {error.message}
          </div>
        </div>
    );
  }

  return (
      <div className="w-full p-0 m-0" dir="rtl">
        {/* Title & Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
          <h1 className="text-h1-bold-24 text-gray-800">الرحلات</h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
          <div className="flex flex-wrap gap-3 ">
            {displayCategories.map((category) => (
                <CategoryTag
                    key={category}
                    category={category}
                    isSelected={selectedCategory === category}
                    onClick={handleCategoryChange}
                />
            ))}
          </div>
          <div>
            <SortFilterButton
                options={filterOptions.map((opt) => opt.label)}
                selectedValue={filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                position="left"
                onChange={(label) => {
                  const matched = filterOptions.find((f) => f.label === label);
                  if (matched) handleFilterChange(matched.value);
                }}
            />
          </div>
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
            basePath={'trips'}
        />

        {/* Show message if no results */}
        {filteredData.length === 0 && tableData.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد رحلات تطابق الفلتر المحدد
            </div>
        )}
      </div>
  );
};

export default Trips;