import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import CommonTable from "@/components/common/CommonTable";
import SortFilterButton from "@/components/common/SortFilterButton";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { getUserEvents } from "@/services/users/usersApi";

const UserEvents = () => {
    const [currentFilter, setCurrentFilter] = useState("الكل");
    const queryClient = useQueryClient();
    const { id: userId } = useParams();

    // Fetch user events using React Query
    const { data: apiData, isLoading, error } = useQuery({
        queryKey: ['userEvents', userId],
        queryFn: async () => {
            try {
                const data = await getUserEvents(userId);

                // Check if we already have events cached from the events page
                const existingEventsCache = queryClient.getQueryData(['events']);

                // Only update cache if we don't already have events data
                if (data && data.activities && !existingEventsCache) {
                    const eventsCache = [];

                    data.activities.forEach(activity => {
                        if (activity && activity.info) {
                            const existingIndex = eventsCache.findIndex(e => e.id === activity.info.id);

                            if (existingIndex === -1) {
                                eventsCache.push(activity.info);
                            } else {
                                eventsCache[existingIndex] = {
                                    ...eventsCache[existingIndex],
                                    ...activity.info
                                };
                            }
                        }
                    });

                    queryClient.setQueryData(['events'], eventsCache);
                }

                return data;
            } catch (err) {
                console.error("❌ Error fetching user events:", err);
                throw err;
            }
        },
        enabled: !!userId,
        retry: 2,
    });

    // Transform API data to match the table structure
    const transformApiData = (apiData) => {
        if (!apiData || !apiData.activities) {
            return [];
        }

        return apiData.activities.map(activity => {
            if (!activity || !activity.info) return null;

            const event = activity.info;
            const bookingInfo = activity.booking_info || {};

            // Format date from "2024-10-10" to "10/10/2024"
            const formattedDate = event.date
                ? event.date.split('-').reverse().join('/')
                : event.start_date
                    ? event.start_date.split('-').reverse().join('/')
                    : 'N/A';

            // Get status from API or use default
            const status = event.status || event.account_status || "لم تبدأ بعد";

            // Format price with currency
            const ticketPrice = event.price
                ? `${event.price}$`
                : event.ticket_price
                    ? `${event.ticket_price}$`
                    : "N/A";

            return {
                id: event.id?.toString() || "N/A",
                eventName: event.name || event.event_name || "غير معروف",
                date: formattedDate,
                duration: event.duration_days ? `${event.duration_days} أيام` :
                    event.duration ? `${event.duration} أيام` : "N/A",
                location: event.place || event.location || "غير معروف",
                tickets_count: bookingInfo.number_of_tickets || event.tickets_count || event.tickets || 0,
                ticket_price: ticketPrice,
                status: status,
                // Include original data for potential future use
                originalData: activity
            };
        }).filter(Boolean); // Remove any null entries
    };

    // Filter options for events
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

    // Columns configuration for events
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

    // Filter and sort the table data
    const filteredData = useMemo(() => {
        if (!apiData) return [];

        let newData = transformApiData(apiData);

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
                    const priceA = parseFloat(a.ticket_price.replace('$', '')) || 0;
                    const priceB = parseFloat(b.ticket_price.replace('$', '')) || 0;
                    return priceB - priceA;
                });
                break;
            case "price_asc":
                newData.sort((a, b) => {
                    const priceA = parseFloat(a.ticket_price.replace('$', '')) || 0;
                    const priceB = parseFloat(b.ticket_price.replace('$', '')) || 0;
                    return priceA - priceB;
                });
                break;
            default:
                break;
        }

        return newData;
    }, [apiData, currentFilter]);

    if (isLoading) return <PageSkeleton rows={6} />;

    if (error) {
        return (
            <div className="p-8 bg-white rounded-lg shadow">
                <div className="text-center text-red-600">
                    <p>حدث خطأ في تحميل البيانات: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2">
                <h1 className="text-h1-bold-24 text-gray-800">
                    الأحداث المحجوزة
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
                    <p className="text-gray-500">لايوجد أحداث محجوزة</p>
                </div>
            ) : (
                <CommonTable
                    columns={columns}
                    data={filteredData}
                    basePath="events"
                    entityType='event'
                />
            )}
        </div>
    );
};

export default UserEvents;