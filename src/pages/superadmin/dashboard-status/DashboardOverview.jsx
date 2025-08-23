// src/components/DashboardOverview.jsx
import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import StatCard from "@/components/common/StatCard";
import Table from "@/components/common/Table.jsx";
import Chart from "@/components/common/Chart.jsx";
import RatingTable from "@/components/common/RatingTable.jsx";
import { getTrips } from "@/services/trips/trips";
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
  { header: "اسم الرحلة", accessor: "name" },
  { header: "اسم الشركة", accessor: "companyName" },
  { header: "التاريخ", accessor: "start_date" },
  { header: "الحالة", accessor: "status" },
];

const topPlacesData = [
  { id: 1, name: "مطعم الشام", rating: 4.8 },
  { id: 2, name: "فندق الأموي", rating: 4.6 },
  { id: 3, name: "مقهى النور", rating: 4.2 },
];

const DashboardOverview = () => {
  // Use React Query for data fetching
  const { data: tripsData, isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      console.time('React Query API Call');
      try {
        const response = await getTrips();
        console.timeEnd('React Query API Call');

        // Debug: Check if company names are present
        console.log('API Response:', response);
        if (response.trips) {
          response.trips.forEach((trip, index) => {
            console.log(`Trip ${index + 1} company:`, trip.company?.name);
          });
        }

        return response;
      } catch (err) {
        console.timeEnd('React Query API Call');
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const trips = tripsData?.trips || [];
  const [currentFilter, setCurrentFilter] = useState("الكل");
  const [filteredData, setFilteredData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);

  // Flatten the data to include companyName field
  useEffect(() => {
    if (trips && trips.length > 0) {
      const newData = trips.slice(0, 6);
      setFilteredData(newData);

      // Create flattened data with companyName
      const flattened = newData.map(trip => ({
        ...trip,
        companyName: trip.company?.name || "غير محدد"
      }));
      setFlattenedData(flattened);

      handleFilterChange(currentFilter, newData);

      // Debug: Check filtered data
      console.log('Filtered Data:', newData);
      console.log('Flattened Data:', flattened);
      newData.forEach((trip, index) => {
        console.log(`Filtered Trip ${index + 1} company:`, trip.company?.name);
      });
    }
  }, [trips, currentFilter]);

  const handleFilterChange = useCallback((filterOption, dataToFilter = trips ? trips.slice(0, 6) : []) => {
    setCurrentFilter(filterOption);

    let newData = [...dataToFilter];

    switch (filterOption) {
      case "حسب التاريخ (الأحدث)":
        newData.sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateB - dateA;
        });
        break;
      case "حسب التاريخ (الأقدم)":
        newData.sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
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
        newData = [...dataToFilter];
        break;
    }

    setFilteredData(newData);

    // Update flattened data as well
    const flattened = newData.map(trip => ({
      ...trip,
      companyName: trip.company?.name || "غير محدد"
    }));
    setFlattenedData(flattened);
  }, [trips]);

  const topCompanyLabels = ["العقاد", "سوريا تورز", "الريحان"];
  const topCompanyTrips = [10, 60, 20];

  if (error) {
    return (
        <div className="space-y-8 px-4">
          <div className="text-red-500 text-center py-8">
            خطأ في تحميل البيانات: {error.message}
          </div>
        </div>
    );
  }

  return (
      <div className="space-y-8 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[65%_33.5%] gap-6 items-start">
          {/* Right Side (65%) - Trips Table */}
          <div>
            <Table
                columns={columns}
                data={flattenedData}
                title="الرحلات"
                currentFilter={currentFilter}
                onFilterChange={handleFilterChange}
                loading={isLoading}
                showSeeAll={true}
                seeAllLink="/trips"
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
                    label="عدد الرحلات"
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