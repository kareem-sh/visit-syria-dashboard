import React, { useRef, useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import ImageSection from "@/components/common/ImageSection";
import CommentsSection from "@/components/common/CommentsSection";
import TripInfoCard from "@/components/common/TripInfoCard.jsx";
import DayDetails from "@/components/common/DayDetails";
import Bookings from "@/components/common/Booking.jsx";
import GoldCircularProgress from "@/components/common/GoldCircularProgress.jsx";
import { PageSkeleton } from "@/components/common/PageSkeleton.jsx";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { getTripById, tripBookings } from "@/services/trips/trips";
import User from "@/assets/icons/common/user.svg";
import Money from "@/assets/icons/common/money.svg";
import Ticket from "@/assets/icons/event/tickets.svg";

// Lazy load the TripMap component
const TripMap = React.lazy(() => import("@/components/common/TripMap"));

const TripDetailsPage = ({ type = "trip" }) => {
    const { id } = useParams();
    const imageRef = useRef(null);
    const [imageHeight, setImageHeight] = useState(0);
    const queryClient = useQueryClient();
    const { isAdmin } = useAuth();

    // ✅ Trip details
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
        staleTime: 5 * 60 * 1000,
        initialData: undefined,
        structuralSharing: (oldData, newData) => newData,
    });

    // ✅ Trip bookings - Only fetch if user is admin
    const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['tripBookings', id],
        queryFn: () => tripBookings(id),
        enabled: !!id && isAdmin,
        refetchOnWindowFocus: false,
    });

    // Keep your existing mock trip path
    const mockTripPath = {
        markers: [
            { lat: 33.5138, lng: 36.2765, title: "ساحة الأمويين" },
            { lat: 33.5074, lng: 36.2988, title: "جامعة دمشق" }
        ],
        route: [
            { lat: 33.5138, lng: 36.2765 },
            { lat: 33.5125, lng: 36.2820 },
            { lat: 33.5109, lng: 36.2885 },
            { lat: 33.5090, lng: 36.2930 },
            { lat: 33.5074, lng: 36.2988 }
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

    // Calculate revenue if trip is completed
    const calculateRevenue = () => {
        if (!tripData) return 0;
        const soldTickets = (tripData.tickets || 0) - (tripData.remaining_tickets || 0);
        return soldTickets * (parseFloat(tripData.price) || 0);
    };

    // Use PageSkeleton for initial loading state
    if (isLoading || isFetching) {
        return <PageSkeleton rows={8} />;
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
    const isTripNotStarted = tripData.status === "لم تبدأ بعد";
    const isTripCompleted = tripData.status === "منتهية";
    const hasTimelines = tripData.timelines && tripData.timelines.length > 0;
    const revenue = calculateRevenue();
    const soldTickets = (tripData.tickets || 0) - (tripData.remaining_tickets || 0);

    return (
        <div className="w-full flex justify-center">
            <div className="details-page w-full px-4 space-y-6">
                {/* Statistics Section - Only show for completed trips and admin users */}
                {isTripCompleted && isAdmin && (
                    <div className="w-full">
                        <h3 className="text-h1-bold-22 mb-4 text-right">احصائيات الرحلة</h3>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Number of Participants Card */}
                                <div className="flex gap-4 items-center text-right p-4 rounded-xl">
                                    <div>
                                        <img src={User} alt="number of participants" className="w-8 h-8" />
                                    </div>
                                    <div className="flex-col">
                                        <h4 className="text-body-bold-16 text-black mb-1">عدد المشاركين بالرحلة</h4>
                                        <p className="text-body-bold-14 text-black">
                                            {(tripData.tickets || 0) - (tripData.remaining_tickets || 0)}
                                        </p>
                                    </div>
                                </div>

                                {/* Remaining Tickets Card */}
                                <div className="flex gap-4 items-center text-right p-4 rounded-xl">
                                    <div>
                                        <img src={Ticket} alt="remaining tickets" className="w-8 h-8" />
                                    </div>
                                    <div className="flex-col">
                                        <h4 className="text-body-bold-16 text-black mb-1">عدد التذاكر المتبقية</h4>
                                        <p className="text-body-bold-14 text-black">
                                            {tripData.remaining_tickets || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Revenue Card */}
                                <div className="flex gap-4 items-center text-right p-4 rounded-xl">
                                    <div>
                                        <img src={Money} alt="revenue" className="w-8 h-8" />
                                    </div>
                                    <div className="flex-col">
                                        <h4 className="text-body-bold-16 text-black mb-1">الأرباح</h4>
                                        <p className="text-body-bold-14 text-black">
                                            {((tripData.tickets || 0) - (tripData.remaining_tickets || 0)) * (parseFloat(tripData.price) || 0).toFixed(2)}$
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Layout: Image + Comments */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    {/* Image Section - Full width if trip not started */}
                    <div
                        ref={imageRef}
                        className={isTripNotStarted ? "w-full" : "flex-1"}
                    >
                        <ImageSection
                            mainImage={mainImage}
                            secondaryImages={secondaryImages}
                            layout={type === "event" ? "event" : "default"}
                        />
                    </div>

                    {/* Comments Section - Hidden if trip not started */}
                    {!isTripNotStarted && (
                        <div
                            className="flex-1 flex flex-col"
                            style={{ height: imageHeight, overflowY: "auto" }}
                        >
                            <h3 className="text-h1-bold-22 mb-2">التقييمات و التعليقات</h3>
                            <CommentsSection
                                comments={tripData.feedback || []}
                                status={tripData.status}
                            />
                        </div>
                    )}
                </div>

                {/* Product Info Card and Day Details */}
                <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                    <div className={hasTimelines ? "lg:w-[60%] w-full flex" : "w-full flex"}>
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
                            images={tripData.images ?? []}
                            className="h-full" // Add h-full to make it fill the container
                        />
                    </div>

                    {hasTimelines && (
                        <div className="flex-1 w-full flex flex-col">
                            <h3 className="text-h1-bold-22 mb-2">جدول الرحلات</h3>
                            <DayDetails days={tripData.timelines} className="h-full" />
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

                {/* ✅ Bookings Section - Only show if user is admin */}
                {isAdmin && (
                    <div className="w-full" dir="rtl">
                        {bookingsLoading ? (
                            <div className="flex justify-center items-center p-8">
                                <GoldCircularProgress color="#10b981" />
                            </div>
                        ) : (
                            <Bookings data={bookings} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripDetailsPage;