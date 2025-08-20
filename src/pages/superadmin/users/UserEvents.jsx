import React, { useState, useMemo, useEffect } from "react";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { PageSkeleton } from "@/components/common/PageSkeleton";

const Events = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentFilter, setCurrentFilter] = useState("الكل");

    // Mock data for events
    const getMockData = () => {
        return [
            {
                id: "EVT-001",
                eventName: "مهرجان الربيع",
                date: "15/03/2025",
                duration: "5 أيام",
                location: "دمشق - حديقة التجارة",
                tickets_count: 200,
                ticket_price: "50$",
                status: "لم تبدأ بعد",
            },
            {
                id: "EVT-002",
                eventName: "حفل موسيقي",
                date: "20/04/2025",
                duration: "1 يوم",
                location: "حلب - المسرح الوطني",
                tickets_count: 150,
                ticket_price: "75$",
                status: "جارية حالياً",
            },
            {
                id: "EVT-003",
                eventName: "معرض الفنون",
                date: "10/02/2025",
                duration: "7 أيام",
                location: "اللاذقية - قصر الثقافة",
                tickets_count: 300,
                ticket_price: "30$",
                status: "منتهية",
            },
            {
                id: "EVT-004",
                eventName: "مؤتمر التكنولوجيا",
                date: "05/05/2025",
                duration: "3 أيام",
                location: "دمشق - فندق الشام",
                tickets_count: 100,
                ticket_price: "120$",
                status: "تم الإلغاء",
            },
            {
                id: "EVT-005",
                eventName: "مهرجان الطعام",
                date: "12/06/2025",
                duration: "2 أيام",
                location: "حمص - ساحة الساعة",
                tickets_count: 250,
                ticket_price: "40$",
                status: "جارية حالياً",
            },
            {
                id: "EVT-006",
                eventName: "عرض الأزياء",
                date: "25/07/2025",
                duration: "1 يوم",
                location: "دمشق - قصر المؤتمرات",
                tickets_count: 180,
                ticket_price: "60$",
                status: "لم تبدأ بعد",
            },
            {
                id: "EVT-007",
                eventName: "مسابقة الشعر",
                date: "08/08/2025",
                duration: "2 أيام",
                location: "حماة - المركز الثقافي",
                tickets_count: 120,
                ticket_price: "25$",
                status: "منتهية",
            },
            {
                id: "EVT-008",
                eventName: "مهرجان السينما",
                date: "18/09/2025",
                duration: "4 أيام",
                location: "طرطوس - المسرح البلدي",
                tickets_count: 220,
                ticket_price: "45$",
                status: "تم الإلغاء",
            }
        ];
    };

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
        { label: "حسب عدد التذاكر (مرتفع)", value: "tickets_desc" },
        { label: "حسب عدد التذاكر (منخفض)", value: "tickets_asc" },
        { label: "حسب السعر (مرتفع)", value: "price_desc" },
        { label: "حسب السعر (منخفض)", value: "price_asc" },
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
        <div className="flex flex-col gap-6 pt-2">
            {/* Title & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2">
                <h1 className="text-h1-bold-24 text-gray-800">الأحداث المحجوزة</h1>
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

            {/* Table */}
            {filteredData.length === 0 ? (
                <div className="p-8 bg-white rounded-lg shadow text-center">
                    <p className="text-gray-500">لا توجد أحداث لعرضها</p>
                </div>
            ) : (
                <CommonTable
                    columns={columns}
                    data={filteredData}
                    basePath="events"
                    entityType='event'
                    showFilter={false}
                    showHeader={false}
                    showSeeAll={false}
                />
            )}
        </div>
    );
};

export default Events;