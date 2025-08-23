// EventDetails.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import EventImageGallery from "@/components/common/EventImageGallery.jsx";
import Map from "@/components/common/Map.jsx";
import EventInfoCard from "@/components/common/EventInfoCard.jsx";
import Bookings from "@/components/common/Booking.jsx";
import EventEditDialog from "@/components/Dialog/EventEditDialog.jsx";
import GoldCircularProgress from "@/components/common/GoldCircularProgress.jsx"; // ✅ Import the spinner

import { eventBookings, updateEvent } from "@/services/events/eventsApi.js";
import { useEvent } from "@/hooks/useEvent";

function EventDetails() {
    const { id } = useParams();
    const numericId = Number(id);
    const queryClient = useQueryClient();

    const {
        data: apiEvent,
        isLoading: eventLoading,
        error: eventError,
    } = useEvent(numericId);

    const {
        data: bookings = [],
        isLoading: bookingsLoading,
    } = useQuery({
        queryKey: ["eventBookings", numericId],
        queryFn: () => eventBookings(numericId),
        enabled: !!numericId,
        refetchOnWindowFocus: false,
    });

    const {
        mutateAsync: mutateUpdateEvent,
        isLoading: updating,
    } = useMutation({
        mutationFn: (data) => updateEvent(numericId, data),
        onSuccess: () => {
            // ✅ Invalidate queries to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['event', numericId] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['eventBookings', numericId] });

            // Close the dialog
            setEditOpen(false);
        },
        onError: (error) => {
            console.error("Update error:", error);
        }
    });

    // Transform API data to component format
    const event = apiEvent
        ? {
            id: apiEvent.id,
            name: apiEvent.name,
            description: apiEvent.description,
            place: apiEvent.place,
            position:
                apiEvent.latitude && apiEvent.longitude
                    ? [parseFloat(apiEvent.latitude), parseFloat(apiEvent.longitude)]
                    : null,
            mainImage: apiEvent.media?.[0] || null,
            secondaryImages: apiEvent.media?.length > 1 ? apiEvent.media.slice(1) : [],
            locationName: apiEvent.place || "",
            refNumber: apiEvent.id?.toString() || "",
            duration: apiEvent.duration_days ?? 0,
            duration_hours: apiEvent.duration_hours ?? 0,
            date: apiEvent.date ? new Date(apiEvent.date).toLocaleDateString("en-GB") : "",
            status: apiEvent.status || "",
            tickets: apiEvent.tickets || 0,
            price: apiEvent.price || 0,
            event_type: apiEvent.event_type || "",
            price_type: apiEvent.price_type || "",
            pre_booking: apiEvent.pre_booking || false,
        }
        : null;

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({});

    const openEditDialog = () => {
        if (!event) return;
        setEditData({
            name: event.name,
            description: event.description,
            place: event.locationName,
            latitude: event.position?.[0] || event.latitude,
            longitude: event.position?.[1] || event.longitude,
            images: [
                ...(event.mainImage ? [{ url: event.mainImage }] : []),
                ...(event.secondaryImages?.map(url => ({ url })) || [])
            ]
        });
        setEditOpen(true);
    };

    const handleSave = async (payload) => {
        try {
            await mutateUpdateEvent(payload);
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    if (eventLoading) return <div className="p-4 text-center">Loading event details...</div>;
    if (eventError) {
        console.error("Event error details:", eventError);
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <h2 className="font-bold">Error loading event</h2>
                <p>{eventError.message || "Please check your connection and try again."}</p>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['event', numericId] })}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }
    if (!event) return <div className="p-4 text-center">Event not found.</div>;

    return (
        <div className="flex flex-col gap-6 w-full" dir="ltr">
            <div className="flex gap-6 w-full">
                <div className="card flex-[0_0_40%] p-4 flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-right">الموقع</h2>
                    <p className="text-right">{event.locationName}</p>
                    <Map
                        position={event.position}
                        width={"100%"}
                        height={200}
                        borderColor="green"
                        borderWidth={4}
                    />
                </div>
                <div className="flex-[1_1_0] p-2">
                    <EventImageGallery
                        mainImage={event.mainImage}
                        secondaryImages={event.secondaryImages}
                    />
                </div>
            </div>
            <div className="w-full" dir="rtl">
                <EventInfoCard
                    title={event.name}
                    refNumber={event.refNumber}
                    id={event.refNumber}
                    description={event.description}
                    place={event.place}
                    duration={event.duration}
                    date={event.date}
                    status={event.status}
                    tickets={event.tickets}
                    price={event.price}
                    eventType={event.event_type}
                    priceType={event.price_type}
                    preBooking={event.pre_booking}
                    onDelete={() => console.log("delete")}
                    onEdit={openEditDialog}
                />
            </div>

            {/* ✅ Updated Bookings Section with Emerald Spinner */}
            <div className="w-full" dir="rtl">
                {bookingsLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <GoldCircularProgress color="#10b981" /> {/* Emerald color for bookings */}
                    </div>
                ) : (
                    <Bookings data={bookings} />
                )}
            </div>

            <EventEditDialog
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialData={editData}
                onSave={handleSave}
                loading={updating}
            />
        </div>
    );
}

export default EventDetails;