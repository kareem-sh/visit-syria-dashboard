import React, { useState, useCallback } from "react";
import StatCard from "@/components/common/StatCard";
import Table from "@/components/common/Table.jsx";
import Chart from "@/components/common/Chart.jsx";
import RatingTable from "@/components/common/RatingTable.jsx";

import moneyIcon from "@/assets/icons/stats card/Stats Card Icons money.svg";
import userIcon from "@/assets/icons/stats card/Stats Card Icons user.svg";
import starIcon from "@/assets/icons/stats card/Stats Card Icons rating.svg";

const statsData = [
  {
    title: "الأرباح",
    value: "$20,300",
    subtitle: "زيادة عن الأسبوع الماضي",
    trend: "8%",
    trendDirection: "up",
    iconSrc: moneyIcon,
    bgColor: "bg-green",
    textColor: "text-white",
    route: "/profits",
  },
  {
    title: "المستخدمين",
    value: "3008",
    subtitle: "نقصان عن الأمس",
    trend: "8%",
    trendDirection: "down",
    iconSrc: userIcon,
    bgColor: "bg-white",
    textColor: "text-black",
    route: "/users",
  },
  {
    title: "التقييمات",
    value: "10000",
    subtitle: "نقصان عن الأمس",
    trend: "8%",
    trendDirection: "up",
    iconSrc: starIcon,
    bgColor: "bg-white",
    textColor: "text-black",
  },
];

const columns = [
  { header: "الرقم التعريفي", accessor: "id" },
  { header: "اسم الرحلة", accessor: "tripName" },
  { header: "اسم الشركة", accessor: "company" },
  { header: "التاريخ", accessor: "date" },
  { header: "الحالة", accessor: "status" },
];

const data = [
  {
    id: "5765",
    tripName: "رحلة في جبلة",
    company: "التعاون",
    date: "25/06/2025",
    status: "لم تبدأ بعد",
  },
  {
    id: "3405834",
    tripName: "رحلة سوريا السياحية",
    company: "النورس",
    date: "31/08/2025",
    status: "منتهية",
  },
  {
    id: "54983",
    tripName: "جولة في الشرق",
    company: "الصفاء",
    date: "20/10/2025",
    status: "جارية حالياً",
  },
  {
    id: "349834",
    tripName: "رحلة إلى آثار تدمر",
    company: "زهور الشام",
    date: "04/09/2025",
    status: "تم الإلغاء",
  },
  {
    id: "349835",
    tripName: "رحلة إلى دمشق القديمة",
    company: "زهور الشام",
    date: "05/09/2025",
    status: "لم تبدأ بعد",
  },
  {
    id: "349836",
    tripName: "رحلة إلى حلب",
    company: "زهور الشام",
    date: "06/09/2025",
    status: "جارية حالياً",
  },
];

const topPlacesData = [
  { id: 1, name: "مطعم الشام", rating: 4.8 },
  { id: 2, name: "فندق الأموي", rating: 4.6 },
  { id: 3, name: "مقهى النور", rating: 4.2 },
];

const DashboardOverview = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [currentFilter, setCurrentFilter] = useState("الكل");

  const handleFilterChange = useCallback((filterOption) => {
    setCurrentFilter(filterOption);

    let newData = [...data];

    switch (filterOption) {
      case "حسب التاريخ (الأحدث)":
        newData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateB - dateA;
        });
        break;
      case "حسب التاريخ (الأقدم)":
        newData.sort((a, b) => {
          const dateA = new Date(a.date.split("/").reverse().join("-"));
          const dateB = new Date(b.date.split("/").reverse().join("-"));
          return dateA - dateB;
        });
        break;
      case "حسب الحالة (منتهية)":
        newData = newData.filter((item) => item.status === "منتهية");
        break;
      case "حسب الحالة (تم الإلغاء)":
        newData = newData.filter((item) => item.status === "تم الإلغاء");
        break;
      case "حسب الحالة (جارية الآن)":
        newData = newData.filter((item) => item.status === "جارية حالياً");
        break;
      case "حسب الحالة (لم تبدأ بعد)":
        newData = newData.filter((item) => item.status === "لم تبدأ بعد");
        break;
      default:
        break;
    }

    setFilteredData(newData);
  }, []);

  const topCompanyLabels = ["العقاد", "سوريا تورز", "الريحان"];
  const topCompanyTrips = [10, 25, 20];

  return (
    <div dir="rtl" className="space-y-8 px-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 items-start">
        {/* Right Side (65%) - Trips Table */}
        <div>
          <Table
            columns={columns}
            data={filteredData}
            title="الرحلات"
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Left Side (35%) - Chart and Rating Table */}
        <div className="flex flex-col gap-6">
          {/* Chart Section */}
          <div>
            <h2 className="text-right text-h1-bold-24 mb-4 text-gray-700 mt-4.5">
              أفضل الشركات
            </h2>
            <div className="shadow rounded-2xl overflow-hidden">
              <Chart
                labels={topCompanyLabels}
                values={topCompanyTrips}
                color="#2FB686"
              />
            </div>
          </div>

          {/* Rating Table Section */}
          <div>
            <h2 className="text-right text-h1-bold-24 mb-4 text-gray-700">
              أفضل الأماكن
            </h2>
            <RatingTable data={topPlacesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
