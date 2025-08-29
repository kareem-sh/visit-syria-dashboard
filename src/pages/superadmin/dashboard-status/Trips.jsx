import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Table from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import Banner from "@/components/common/banner";
import { getTrips, createTrip } from "@/services/trips/trips";
import { useAuth } from "@/contexts/AuthContext";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import TripIcon from "@/assets/icons/common/Add Trip.svg";
import TripDialog from "@/components/dialog/TripDialog";

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

const displayCategories = [
  "الكل",
  "تاريخية",
  "ثقافية",
  "ترفيهية",
  "دينية",
  "طبيعية",
  "أثرية",
  "طعام",
  "عادات وتقاليد",
];

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
  const { isAdmin } = useAuth();

  // ✅ Fetch trips
  const {
    data: tripsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips("الكل"),
    staleTime: 5 * 60 * 1000,
  });

  // ✅ Mutation for creating trip
  const { mutate: mutateCreateTrip, isPending: isCreating } = useMutation({
    mutationFn: (tripData) => {
      // Log the data before API call
      console.log("🔍 Trip data before sending to API:", tripData);

      // Make the actual API call
      return createTrip(tripData);
    },
    onSuccess: (responseData) => {
      // Log API response
      console.log("✅ API Response:", responseData);

      // Check if the response contains the expected trip object
      if (responseData && responseData.trip) {
        setIsTripDialogOpen(false);
        refetch();
        // toast.success("تم إنشاء الرحلة بنجاح");
      } else {
        // If not, it's an unexpected format, so we can log an error and handle it gracefully
        console.error("❌ Unexpected success response format:", responseData);
        // This is a good place to show a user-facing error message, e.g., using toast
        // toast.error("فشل في إنشاء الرحلة: تنسيق الاستجابة غير متوقع");
      }
    },
    onError: (err) => {
      console.error("❌ Error creating trip:", err);

      // If backend returned validation errors, log them
      if (err.response) {
        console.error("⚠️ Backend Response:", err.response.data);
      }

      // toast.error("فشل في إنشاء الرحلة");
    },
  });

  const [currentFilter, setCurrentFilter] = useState("الكل");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);

  const handleManualRefetch = () => {
    refetch();
  };

  const handleFilterChange = useCallback((filterValue) => {
    setCurrentFilter(filterValue);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCreateTrip = () => {
    setIsTripDialogOpen(true);
  };

  const handleSaveTrip = async (tripData) => {
    try {
      // Log the exact data before sending to API
      console.log("🔍 Trip data before sending to API:", tripData);

      // Call API using mutation
      mutateCreateTrip(tripData);
    } catch (error) {
      console.error("❌ Error creating trip:", error);

      // If backend returned validation errors, log them
      if (error.response) {
        console.error("⚠️ Backend Response:", error.response.data);
      }

      // toast.error("فشل في إنشاء الرحلة");
    }
  };

  const tableData = useMemo(() => {
    if (!tripsData?.trips) return [];

    return tripsData.trips.map((trip) => ({
      id: trip.id,
      name: trip.name,
      companyName: trip.company?.name || "غير محدد",
      start_date: trip.start_date,
      days: trip.days,
      tickets: trip.tickets,
      price: trip.price,
      status: trip.status,
      categories: trip.tags || [],
      feedback: trip.feedback || [],
      is_saved: trip.is_saved ?? null,
      trip_path: trip.trip_path || null,
      timelines: trip.timelines || [],
    }));
  }, [tripsData]);

  const filteredData = useMemo(() => {
    let newData = [...tableData];

    if (selectedCategory !== "الكل") {
      newData = newData.filter(
          (trip) => trip.categories && trip.categories.includes(selectedCategory)
      );
    }

    switch (currentFilter) {
      case "latest":
        newData.sort(
            (a, b) => new Date(b.start_date) - new Date(a.start_date)
        );
        break;
      case "oldest":
        newData.sort(
            (a, b) => new Date(a.start_date) - new Date(b.start_date)
        );
        break;
      case "منتهية":
      case "تم الإلغاء":
      case "جارية حالياً":
      case "لم تبدأ بعد":
        newData = newData.filter((item) => item.status === currentFilter);
        break;
      default:
        break;
    }

    return newData;
  }, [currentFilter, selectedCategory, tableData]);

  if (isLoading) {
    return <PageSkeleton rows={8} />;
  }

  if (error) {
    return (
        <div className="w-full p-0 m-0" dir="rtl">
          <div className="text-red-500 text-center py-8">
            <div className="text-lg font-semibold mb-2">خطأ في تحميل البيانات</div>
            <div className="text-sm mb-4">{error.message}</div>
            <button
                onClick={handleManualRefetch}
                className="bg-green text-white px-6 py-2 rounded-lg hover:bg-green-dark transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="w-full p-0 m-0" dir="rtl">
        {/* Conditional Banner for Admin Users */}
        {isAdmin && (
            <Banner
                title="إضافة رحلة"
                description="يرجى إدخال بيانات الفعالية الجديدة لإدراجها ضمن الأنشطة المعتمدة من وزارة السياحة"
                showButton={true}
                buttonText="إضافة"
                onButtonClick={handleCreateTrip}
                icon={TripIcon}
            />
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2 mt-6">
          <h1 className="text-h1-bold-24 text-gray-800">الرحلات</h1>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 px-2">
          <div className="flex flex-wrap gap-3">
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
                selectedValue={
                    filterOptions.find((opt) => opt.value === currentFilter)?.label ||
                    "الكل"
                }
                position="left"
                onChange={(label) => {
                  const matched = filterOptions.find((f) => f.label === label);
                  if (matched) handleFilterChange(matched.value);
                }}
            />
          </div>
        </div>

        <Table
            columns={columns}
            data={filteredData}
            currentFilter={currentFilter}
            onFilterChange={handleFilterChange}
            showFilter={false}
            showHeader={false}
            showSeeAll={false}
            basePath={"trips"}
        />

        {filteredData.length === 0 && tableData.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد رحلات تطابق الفلتر المحدد
            </div>
        )}

        {tableData.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              لا توجد رحلات متاحة حالياً
            </div>
        )}

        {/* Trip Dialog */}
        <TripDialog
            isOpen={isTripDialogOpen}
            onClose={() => setIsTripDialogOpen(false)}
            onSave={handleSaveTrip}
            mode="create"
            isLoading={isCreating}
        />
      </div>
  );
};

export default Trips;