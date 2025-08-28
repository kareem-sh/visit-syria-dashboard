import React, { useRef, useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import TripInfoCard from "@/components/common/TripInfoCard.jsx";
import DayDetails from "@/components/common/DayDetails";
import { getTripById } from "@/services/trips/trips"; // Import the API function directly

// Lazy load the TripMap component
const TripMap = React.lazy(() => import("@/components/common/TripMap"));

const TripDetailsPage = ({ type = "event" }) => {
    const { id } = useParams();
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);
    const queryClient = useQueryClient();

    // Use React Query directly instead of the custom hook
    const { data: tripData, isLoading, error, isFetching } = useQuery({
        queryKey: ['trip', id],
        queryFn: async () => {
            console.time('Trip Details API Call');
            try {
                const trip = await getTripById(id);
                console.timeEnd('Trip Details API Call');
                return trip;
            } catch (err) {
                console.timeEnd('Trip Details API Call');
                throw err;
            }
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        // Don't read from any other cache, always fetch from API
        initialData: undefined,
        // Prevent any cache sharing with trips list
        structuralSharing: (oldData, newData) => newData,
    });

    // Mock trip path data for testing (Damascus to Aleppo)
    const mockTripPath = {
        markers: [
            { lat: 33.5138, lng: 36.2765, title: "ساحة الأمويين" }, // Umayyad Square
            { lat: 33.5074, lng: 36.2988, title: "جامعة دمشق" }   // Damascus University
        ],
        route: [
            { lat: 33.5138, lng: 36.2765 }, // start - Umayyad Square
            { lat: 33.5125, lng: 36.2820 }, // Shukri al-Quwatli Street
            { lat: 33.5109, lng: 36.2885 }, // Near Victoria Bridge
            { lat: 33.5090, lng: 36.2930 }, // Baramkeh area
            { lat: 33.5074, lng: 36.2988 }  // end - Damascus University
        ]
    };

    useEffect(() => {
        if (!tripData || !tripData.images) return;
        const measure = () => {
            if (imageRef.current) {
                setImageHeight(imageRef.current.clientHeight);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [tripData?.images]);

    // Show loading state
    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green"></div>
                <span className="ml-3">جاري تحميل بيانات الرحلة...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 text-red-500">
                خطأ في تحميل البيانات: {error.message}
                <button
                    onClick={() => queryClient.refetchQueries({ queryKey: ['trip', id] })}
                    className="block mt-4 mx-auto bg-green text-white px-4 py-2 rounded-md hover:bg-green-dark transition-colors"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (!tripData) {
        return (
            <div className="text-center p-10 text-red-500">
                الرحلة غير موجودة أو تم حذفها.
            </div>
        );
    }

    const mainImage = tripData.images?.[0];
    const secondaryImages = tripData.images?.slice(1) || [];

    return (
        <div className="w-full flex justify-center">
            <div className="details-page w-full px-4 space-y-6">
                {/* Top Layout: Image + Comments */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    {/* Image Section */}
                    <div ref={imageRef} className="flex-1">
                        <ImageSection
                            mainImage={mainImage}
                            secondaryImages={secondaryImages}
                            layout={type === "event" ? "event" : "default"}
                        />
                    </div>

                    {/* Comments Section */}
                    <div
                        className="flex-1 flex flex-col"
                        style={{ height: imageHeight, overflowY: "auto" }}
                    >
                        <h3 className="text-h1-bold-22 mb-2">التقييمات و التعليقات</h3>
                        <CommentsSection comments={tripData.feedback || []} status={tripData.status} />
                    </div>
                </div>

                {/* Product Info Card and Day Details */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    {/* Product Info Card */}
                    <div className="lg:w-[60%] w-full flex">
                        <TripInfoCard
                            title={tripData.name}
                            price={tripData.price}
                            capacity={tripData.tickets}
                            discount={tripData.discount}
                            refNumber={tripData.id}
                            rating={tripData.company?.rating}
                            tags={tripData.tags}
                            description={tripData.description}
                            company={tripData.company}
                            season={tripData.season}
                            duration={tripData.days}
                            date={tripData.start_date}
                            status={tripData.status}
                        />
                    </div>

                    {/* Day Details */}
                    {tripData.timelines && tripData.timelines.length > 0 && (
                        <div className="flex-1 w-full flex flex-col">
                            <h3 className="text-h1-bold-22 mb-2">جدول الرحلات</h3>
                            <DayDetails days={tripData.timelines} />
                        </div>
                    )}
                </div>

                {/* Trip Map Section */}
                <div className="w-full">
                    <h3 className="text-h1-bold-22 mb-4">خريطة الرحلة</h3>
                    <Suspense fallback={
                        <div className="flex justify-center items-center h-96 bg-gray-100 rounded-xl">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-2"></div>
                                <p className="text-gray-600">جاري تحميل الخريطة...</p>
                            </div>
                        </div>
                    }>
                        <TripMap
                            tripPath={tripData.trip_path || mockTripPath}
                            width="100%"
                            height="500px"
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default TripDetailsPage;