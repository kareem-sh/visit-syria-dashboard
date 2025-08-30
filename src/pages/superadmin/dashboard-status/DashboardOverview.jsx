// src/components/DashboardOverview.jsx
import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import StatCard from "@/components/common/StatCard";
import Table from "@/components/common/Table.jsx";
import Chart from "@/components/common/Chart.jsx";
import RatingTable from "@/components/common/RatingTable.jsx";
import { getTrips } from "@/services/trips/trips";
import { getEarning, getUser, getRating, topCompanies, getTopPlaces } from "@/services/statistics/statistics.js";
import moneyIcon from "@/assets/icons/stats card/Stats Card Icons money.svg";
import userIcon from "@/assets/icons/stats card/Stats Card Icons user.svg";
import starIcon from "@/assets/icons/stats card/Stats Card Icons rating.svg";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";

const DashboardOverview = () => {
  // Use React Query for data fetching
  const { data: tripsData, isLoading: tripsLoading, error: tripsError } = useQuery({
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
    staleTime: 5 * 60 * 1000,
  });

  // Fetch statistics data
  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ['earnings'],
    queryFn: getEarning,
    staleTime: 5 * 60 * 1000,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings'],
    queryFn: getRating,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch top companies data
  const { data: topCompaniesData, isLoading: topCompaniesLoading } = useQuery({
    queryKey: ['topCompanies'],
    queryFn: () => topCompanies('trip'),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch top places data
  const { data: topPlacesData, isLoading: topPlacesLoading } = useQuery({
    queryKey: ['topPlaces'],
    queryFn: getTopPlaces,
    staleTime: 5 * 60 * 1000,
  });

  // State hooks - must be declared before any conditional returns
  const [currentFilter, setCurrentFilter] = useState("الكل");
  const [filteredData, setFilteredData] = useState([]);
  const [flattenedData, setFlattenedData] = useState([]);

  // Show skeleton while loading - moved after all hooks
  const isLoading = tripsLoading || earningsLoading || usersLoading || ratingsLoading ||
      topCompaniesLoading || topPlacesLoading;

  // Prepare stats data from API responses
  const statsData = [
    {
      title: "الأرباح",
      value: earningsData?.data?.earnings ? `$${earningsData.data.earnings.toFixed(2)}` : "$0",
      subtitle: earningsData?.data?.changeFromLastWeek >= 0 ? "زيادة عن الأسبوع الماضي" : "نقصان عن الأسبوع الماضي",
      trend: earningsData?.data?.changeFromLastWeek ? `${Math.abs(earningsData.data.changeFromLastWeek)}%` : "0%",
      trendDirection: earningsData?.data?.changeFromLastWeek >= 0 ? "up" : "down",
      iconSrc: moneyIcon,
      bgColor: "bg-green",
      textColor: "text-white",
      route: "/profits",
      isLoading: earningsLoading,
    },
    {
      title: "المستخدمين",
      value: usersData?.data?.users ? usersData.data.users.toString() : "0",
      subtitle: usersData?.data?.changeFromLastDay >= 0 ? "زيادة عن الأمس" : "نقصان عن الأمس",
      trend: usersData?.data?.changeFromLastDay ? `${Math.abs(usersData.data.changeFromLastDay)}%` : "0%",
      trendDirection: usersData?.data?.changeFromLastDay >= 0 ? "up" : "down",
      iconSrc: userIcon,
      bgColor: "bg-white",
      textColor: "text-black",
      route: "/users",
      isLoading: usersLoading,
    },
    {
      title: "التقييمات",
      value: ratingsData?.data?.ratings ? ratingsData.data.ratings.toString() : "0",
      subtitle: ratingsData?.data?.changeFromLastDay >= 0 ? "زيادة عن الأمس" : "نقصان عن الأمس",
      trend: ratingsData?.data?.changeFromLastDay ? `${Math.abs(ratingsData.data.changeFromLastDay)}%` : "0%",
      trendDirection: ratingsData?.data?.changeFromLastDay >= 0 ? "up" : "down",
      iconSrc: starIcon,
      bgColor: "bg-white",
      textColor: "text-black",
      isLoading: ratingsLoading,
    },
  ];

  const topCompaniesChartData = topCompaniesData?.data?.companies
      ?.slice(0, 3)
      .map(company => ({
        label: company.name_of_company,
        value: company.number_of_trips
      })) || [];

  const topCompanyLabels = topCompaniesChartData.map(item => item.label);
  const topCompanyTrips = topCompaniesChartData.map(item => item.value);

  // Prepare top places data for RatingTable
  const formattedTopPlacesData = topPlacesData?.data?.places?.map((place, index) => ({
    id: place.id,
    name: place.name,
    rating: place.rating,
    city: place.city,
    type: place.type,
    image: place.image,
    rank: index + 1
  })) || [];

  const trips = tripsData?.trips || [];

  // Flatten the data to include companyName field
  useEffect(() => {
    if (trips && trips.length > 0) {
      const newData = trips.slice(0, 6);
      setFilteredData(newData);

      const flattened = newData.map(trip => ({
        ...trip,
        companyName: trip.company?.name || "غير محدد"
      }));
      setFlattenedData(flattened);

      handleFilterChange(currentFilter, newData);

      console.log('Filtered Data:', newData);
      console.log('Flattened Data:', flattened);
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

    const flattened = newData.map(trip => ({
      ...trip,
      companyName: trip.company?.name || "غير محدد"
    }));
    setFlattenedData(flattened);
  }, [trips]);

  const columns = [
    { header: "الرقم التعريفي", accessor: "id" },
    { header: "اسم الرحلة", accessor: "name" },
    { header: "اسم الشركة", accessor: "companyName" },
    { header: "التاريخ", accessor: "start_date" },
    { header: "الحالة", accessor: "status" },
  ];

  // Now we can check for loading after all hooks have been declared
  if (isLoading) {
    return <PageSkeleton rows={8} />;
  }

  if (tripsError) {
    return (
        <div className="space-y-8 px-4">
          <div className="text-red-500 text-center py-8">
            خطأ في تحميل البيانات: {tripsError.message}
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
                loading={tripsLoading}
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
                    loading={topCompaniesLoading}
                />
              </div>
            </div>

            {/* Rating Table Section */}
            <div>
              <h2 className="text-right text-h1-bold-24 mb-4 text-gray-700">
                أفضل الأماكن
              </h2>
              <RatingTable
                  data={formattedTopPlacesData}
                  loading={topPlacesLoading}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardOverview;