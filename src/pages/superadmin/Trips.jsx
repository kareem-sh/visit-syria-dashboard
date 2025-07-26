import React, { useState, useCallback } from "react";
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton"; // updated import

const columns = [
  { header: "الرقم التعريفي", accessor: "id" },
  { header: "اسم الرحلة", accessor: "tripName" },
  { header: "اسم الشركة", accessor: "company" },
  { header: "التاريخ", accessor: "date" },
  { header: "المدة", accessor: "duration" },
  { header: "عدد التذاكر", accessor: "tickets_count" },
  { header: "سعر التذكرة", accessor: "ticket_price" },
  { header: "الحالة", accessor: "status" },
];

const rawData = [
  {
    id: "5765",
    tripName: "رحلة في جبلة",
    company: "التعاون",
    date: "25/06/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "لم تبدأ بعد",
  },
  {
    id: "5766",
    tripName: "رحلة غروب الشمس",
    company: "الشام",
    date: "26/06/2025",
    duration: "1 يوم",
    tickets_count: 40,
    ticket_price: "80$",
    status: "جارية حالياً",
  },
  {
    id: "3405834",
    tripName: "رحلة سوريا السياحية",
    company: "النورس",
    date: "31/08/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "منتهية",
  },
  {
    id: "54983",
    tripName: "جولة في الشرق",
    company: "الصفاء",
    date: "20/10/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "جارية حالياً",
  },
  {
    id: "349834",
    tripName: "رحلة إلى آثار تدمر",
    company: "زهور الشام",
    date: "04/09/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "تم الإلغاء",
  },
  {
    id: "349835",
    tripName: "رحلة إلى دمشق القديمة",
    company: "زهور الشام",
    date: "05/09/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "لم تبدأ بعد",
  },
  {
    id: "349836",
    tripName: "رحلة إلى حلب",
    company: "زهور الشام",
    date: "06/09/2025",
    duration: "3 أيام",
    tickets_count: 55,
    ticket_price: "100$",
    status: "جارية حالياً",
  },
  {
    id: "349837",
    tripName: "رحلة وادي بردى",
    company: "السفاري",
    date: "15/09/2025",
    duration: "2 أيام",
    tickets_count: 30,
    ticket_price: "120$",
    status: "منتهية",
  },
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

const Trips = () => {
  const [filteredData, setFilteredData] = useState(rawData);
  const [currentFilter, setCurrentFilter] = useState("الكل");

  const handleFilterChange = useCallback((filterValue) => {
    setCurrentFilter(filterValue);

    let newData = [...rawData];

    switch (filterValue) {
      case "latest":
        newData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateB - dateA;
        });
        break;

      case "oldest":
        newData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateA - dateB;
        });
        break;

      case "منتهية":
      case "تم الإلغاء":
      case "جارية حالياً":
      case "لم تبدأ بعد":
        newData = newData.filter((item) => item.status === filterValue);
        break;

      default:
        newData = rawData;
    }

    setFilteredData(newData);
  }, []);

  return (
    <div className="w-full p-0 m-0">
      {/* Title & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
        <h1 className="text-h1-bold-24 text-gray-800">الرحلات</h1>

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
      />
    </div>
  );
};

export default Trips;
