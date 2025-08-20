// components/users/UserTrips.jsx
import React, { useState, useMemo, useEffect } from "react";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { PageSkeleton } from "@/components/common/PageSkeleton";

const UserTrips = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // Mock data for trips with the correct structure
    const getMockData = () => {
        return [
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
            }
        ];
    };

    // Filter options for trips
    const filterOptions = [
        { label: "الكل", value: "الكل" },
        { label: "حسب التاريخ (الأقدم)", value: "oldest" },
        { label: "حسب التاريخ (الأحدث)", value: "latest" },
        { label: "حسب الحالة (منتهية)", value: "منتهية" },
        { label: "حسب الحالة (تم الإلغاء)", value: "تم الإلغاء" },
        { label: "حسب الحالة (جارية الآن)", value: "جارية حالياً" },
        { label: "حسب الحالة (لم تبدأ بعد)", value: "لم تبدأ بعد" },
        { label: "حسب عدد التذاكر (مرتفع)", value: "tickets_desc" },
        { label: "حسب عدد التذاكر (منخفض)", value: "tickets_asc" },
        { label: "حسب السعر (مرتفع)", value: "price_desc" },
        { label: "حسب السعر (منخفض)", value: "price_asc" },
    ];

    // Columns configuration for trips
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

    // Load mock data with simulated API delay
    useEffect(() => {
        const loadMockData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                const mockData = getMockData();
                setData(mockData);
            } catch (err) {
                setError("فشل في تحميل البيانات");
                console.error("Failed to load mock data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadMockData();
    }, []);

    // Filter and sort the table data
    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        let newData = [...data];

        switch (currentFilter) {
            case "oldest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateA - dateB;
                });
                break;
            case "latest":
                newData.sort((a, b) => {
                    const dateA = new Date(a.date.split("/").reverse().join("-"));
                    const dateB = new Date(b.date.split("/").reverse().join("-"));
                    return dateB - dateA;
                });
                break;
            case "منتهية":
            case "تم الإلغاء":
            case "جارية حالياً":
            case "لم تبدأ بعد":
                newData = newData.filter((item) => item.status === currentFilter);
                break;
            case "tickets_desc":
                newData.sort((a, b) => b.tickets_count - a.tickets_count);
                break;
            case "tickets_asc":
                newData.sort((a, b) => a.tickets_count - b.tickets_count);
                break;
            case "price_desc":
                newData.sort((a, b) => {
                    const priceA = parseInt(a.ticket_price.replace('$', ''));
                    const priceB = parseInt(b.ticket_price.replace('$', ''));
                    return priceB - priceA;
                });
                break;
            case "price_asc":
                newData.sort((a, b) => {
                    const priceA = parseInt(a.ticket_price.replace('$', ''));
                    const priceB = parseInt(b.ticket_price.replace('$', ''));
                    return priceA - priceB;
                });
                break;
            default:
                break;
        }

        return newData;
    }, [data, currentFilter]);

    if (loading) return <PageSkeleton rows={6} />;

    if (error) {
        return (
            <div className="p-8 bg-white rounded-lg shadow">
                <div className="text-center text-red-600">
                    <p>حدث خطأ في تحميل البيانات: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2">
                <h1 className="text-h1-bold-24 text-gray-800">
                    الرحلات المحجوزة
                </h1>
                <SortFilterButton
                    options={filterOptions.map((opt) => opt.label)}
                    selectedValue={currentFilter === "الكل" ? "الكل" :
                        filterOptions.find(opt => opt.value === currentFilter)?.label || "الكل"}
                    position="left"
                    onChange={(label) => {
                        const matched = filterOptions.find((f) => f.label === label);
                        if (matched) setCurrentFilter(matched.value);
                    }}
                />
            </div>

            {filteredData.length === 0 ? (
                <div className="p-8 bg-white rounded-lg shadow text-center">
                    <p className="text-gray-500">لا توجد رحلات لعرضها</p>
                </div>
            ) : (
                <CommonTable
                    columns={columns}
                    data={filteredData}
                    basePath="trips"
                    entityType='company'
                />
            )}
        </div>
    );
};

export default UserTrips;