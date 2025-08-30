// pages/SavedPlaces.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CommonTable from "@/components/common/CommonTable";
import { Star, Trash2, AlertCircle } from "lucide-react";
import { deleteSave, getSavedItems } from "@/services/places/placesApi";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";

const SavedPlaces = () => {
    const [currentType, setCurrentType] = useState("restaurant");
    const queryClient = useQueryClient();

    // Fetch saved items with React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["savedItems", currentType],
        queryFn: () => getSavedItems(currentType),
        retry: 2,
        refetchOnWindowFocus: false,
    });

    // Delete mutation with React Query
    const deleteMutation = useMutation({
        mutationFn: deleteSave,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["savedItems", currentType] });
        },
        onError: (err) => {
            console.error("Failed to remove saved place", err);
        },
    });

    const handleRowClick = (row) => {
        // Navigate to: places/cities/(cityname)/(type)/(id)
        window.location.href = `/places/cities/${row.city}/${row.type}/${row.id}`;
    };

    const handleRemove = async (row, e) => {
        e.stopPropagation();
        deleteMutation.mutate(row.id);
    };

    // Table headers based on type
    const columns = useMemo(() => {
        const ratingColumn = {
            header: "التقييم",
            accessor: "rating",
            render: (value) => (
                <div className="flex items-center justify-center gap-1">
                    {value || 0} <Star size={16} fill="currentColor" className="text-yellow-500" />
                </div>
            ),
        };

        const cityColumn = {
            header: "المدينة",
            accessor: "city",
        };

        const removeColumn = {
            header: "حذف",
            accessor: "remove",
            render: (_, row) => (
                <button
                    onClick={(e) => handleRemove(row, e)}
                    className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
                    aria-label="حذف العنصر"
                >
                    <Trash2 size={20} className="text-red-600" />
                </button>
            ),
        };

        switch (currentType) {
            case "restaurant":
                return [
                    { header: "الرقم التعريفي", accessor: "id" },
                    { header: "اسم المطعم", accessor: "name" },
                    { header: "المدينة", accessor: "city" },
                    { header: "عدد الأفرع", accessor: "branches" },
                    ratingColumn,
                    removeColumn,
                ];
            case "hotel":
                return [
                    { header: "الرقم التعريفي", accessor: "id" },
                    { header: "اسم الفندق", accessor: "name" },
                    { header: "المدينة", accessor: "city" },
                    { header: "عدد الأفرع", accessor: "branches" },
                    ratingColumn,
                    removeColumn,
                ];
            case "tourist":
                return [
                    { header: "الرقم التعريفي", accessor: "id" },
                    { header: "اسم الموقع", accessor: "name" },
                    { header: "المدينة", accessor: "city" },
                    { header: "النوع", accessor: "classification" },
                    ratingColumn,
                    removeColumn,
                ];
            default:
                return [];
        }
    }, [currentType]);

    const handleTypeChange = (type) => {
        setCurrentType(type);
    };

    const typeLabels = {
        hotel: "الفنادق",
        restaurant: "المطاعم",
        tourist: "المواقع السياحية",
    };

    // Show page skeleton while loading
    if (isLoading) {
        return <PageSkeleton rows={8} />;
    }

    if (isError) {
        return (
            <div className="w-full p-4 flex flex-col items-center justify-center min-h-[400px]">
                <AlertCircle size={32} className="text-red-500 mb-4" />
                <p className="text-red-500 mb-2">فشل في تحميل العناصر المحفوظة</p>
                <p className="text-gray-600 text-sm">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="w-full p-4 space-y-6">
            {/* Title and Radio Buttons with Labels */}
            <div className="flex items-center justify-between mb-4 px-4 flex-wrap gap-4">
                <h2 className="text-h1-bold-24 text-gray-700">العناصر المحفوظة</h2>
                <div className="flex items-center gap-4">
                    {["restaurant", "hotel", "tourist"].map((type) => (
                        <div key={type} className="flex items-center gap-2 cursor-pointer" onClick={() => handleTypeChange(type)}>
                            <div
                                className={`w-5 h-5 rounded-full border-2 transition-colors ${
                                    currentType === type
                                        ? "bg-emerald-450 border-emerald-450"
                                        : "bg-white border-gray-400"
                                }`}
                            />
                            <span className="text-black font-medium text-sm">{typeLabels[type]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            {data && data.length > 0 ? (
                <CommonTable
                    columns={columns}
                    data={data}
                    rowGap="space-y-4"
                    rowHeight="h-[75px]"
                    onRowClick={handleRowClick}
                />
            ) : (
                <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <p className="text-lg">لا توجد عناصر محفوظة في قسم {typeLabels[currentType]}</p>
                    <p className="text-sm mt-2">سيظهر هنا العناصر التي تقوم بحفظها</p>
                </div>
            )}
        </div>
    );
};

export default SavedPlaces;