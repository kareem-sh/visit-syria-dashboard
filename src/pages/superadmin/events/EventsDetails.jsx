import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import EventImageGallery from "@/components/common/EventImageGallery.jsx";
import Map from "@/components/common/Map.jsx";
import EventInfoCard from "@/components/common/EventInfoCard.jsx";
import Bookings from "@/components/common/Booking.jsx";
import EventEditDialog from "@/components/Dialog/EventEditDialog.jsx";

import { eventBookings, getEventById, updateEvent } from "@/services/events/eventsApi.js";

function EventDetails() {
    const { id } = useParams();
    const numericId = Number(id);

    const {
        data: bookings = [],
        isLoading: bookingsLoading,
        refetch: refetchBookings,
    } = useQuery({
        queryKey: ["eventBookings", numericId],
        queryFn: () => eventBookings(numericId),
        enabled: !!numericId,
        refetchOnWindowFocus: false,
    });

    const {
        data: apiEvent,
        isLoading: eventLoading,
        error: eventError,
        refetch: refetchEvent,
    } = useQuery({
        queryKey: ["event", numericId],
        queryFn: () => getEventById(numericId),
        enabled: !!numericId,
        refetchOnWindowFocus: false,
    });

    const {
        mutateAsync: mutateUpdateEvent,
        isLoading: updating,
    } = useMutation({
        mutationFn: (data) => updateEvent(numericId, data),
        onSuccess: () => {
            refetchEvent();
            refetchBookings();
        }
    });

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
            refNumber: apiEvent.id ?? "",
            duration: apiEvent.duration_days ?? 0,
            duration_hours: apiEvent.duration_hours ?? 0,
            date: apiEvent.date ? new Date(apiEvent.date).toLocaleDateString("en-GB") : "",
            status: apiEvent.status || "",
            tickets: apiEvent.tickets,
            price: apiEvent.price,
            event_type: apiEvent.event_type ?? "",
            price_type: apiEvent.price_type ?? "",
            pre_booking: apiEvent.pre_booking ?? false,
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
            latitude: event.position?.[0],
            longitude: event.position?.[1],
            images: [
                ...(event.mainImage ? [{ url: event.mainImage }] : []),
                ...(event.secondaryImages?.map(url => ({ url })) || [])
            ]
        });
        setEditOpen(true);
    };

    const handleSave = async (payload) => {
        await mutateUpdateEvent(payload);
        setEditOpen(false);
    };

    if (eventLoading) return <div>Loading...</div>;
    if (eventError) return <div>Error loading event.</div>;
    if (!event) return <div>Not found.</div>;

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
            <div className="w-full" dir="rtl">
                <Bookings data={bookings} />
            </div>
            <EventEditDialog
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialData={editData}
                onSave={handleSave}
            />
        </div>
    );
}

export default EventDetails;
