import apiClient from "../apiClient.js";

export const getEvents = async () => {
    const res = await apiClient.get("/admin/events");

    const eventsArray = res?.data?.data;
    if (!eventsArray) {
        console.error("API response invalid:", res);
        return [];
    }

    return eventsArray.map((event) => ({
        // Full event data for caching
        id: event.id,
        name: event.name,
        description: event.description,
        longitude: event.longitude,
        latitude: event.latitude,
        place: event.place,
        date: event.date,
        duration_days: event.duration_days,
        duration_hours: event.duration_hours,
        tickets: event.tickets,
        price: event.price,
        event_type: event.event_type,
        price_type: event.price_type,
        pre_booking: event.pre_booking,
        status: event.status,
        media: event.media || [],

        // Formatted fields for display in table
        eventName: event.name,
        formattedDate: event.date ? new Date(event.date).toLocaleDateString("en-GB") : "-",
        duration: `${event.duration_days || 0} أيام`,
        location: event.place
            ? event.place.length > 30
                ? event.place.slice(0, 25) + "..."
                : event.place
            : "-",
        tickets_count: event.tickets || 0,
        ticket_price: event.price_type === "free" ? "مجاني" : `${event.price} $`,
    }));
};

// Create a new event
export const createEvent = async (formData) => {
    try {
        const data = new FormData();

        // Append all fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                value.forEach((img, index) => {
                    data.append(`images[]`, img);
                });
            } else {
                data.append(key, value);
            }
        });

        const res = await apiClient.post("/events", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (err) {
        console.error("Error creating event:", err.response?.data || err);
        throw err;
    }
};

export const eventBookings = async (eventId) => {
    try {
        const res = await apiClient.get(`/persons/book/${eventId}?type=event`);
        const infoArray = res?.data?.info;

        if (!infoArray) {
            console.error("API response invalid:", res);
            return [];
        }

        return infoArray.map((booking, index) => {
            const person = booking.person || {};
            const profile = person.profile || {};
            const passengers = booking.passengers || [];
            const bill = booking.bill || {};

            return {
                // TABLE data
                refNumber: person.user_id || index,
                userName:
                    profile.first_name && profile.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : person.email || "مجهول",
                bookingDate: bill.booking_date ?? null,
                amount: Number(bill.total_price ?? 0),
                peopleCount: Number(bill.number_of_tickets ?? passengers.length ?? 0),

                // EXTRA
                email: person.email || "-",
                phone: profile.phone || "-",
                date_of_birth: profile.date_of_birth || "-",
                gender: profile.gender || "-",
                nationality: profile.country || "-",

                passengersCount: passengers.length,
                passengers,

                invoice: {
                    ticketsCount: bill.number_of_tickets || 0,
                    ticketPrice: Number(bill.price || 0),
                    totalPrice: Number(bill.total_price || 0),
                },

                id: bill.booking_id ?? null,

                raw: booking,
            };
        });
    } catch (err) {
        console.error("Error fetching event bookings:", err.response?.data || err);
        throw err;
    }
};

// Get single event by id (do NOT modify media URLs)
export const getEventById = async (id) => {
    try {
        console.log(`🌐 Fetching event with id: ${id}`);
        const res = await apiClient.get(`/events/${id}`);
        const event = res?.data?.data ?? res?.data;

        if (!event) {
            console.error("❌ Event not found or invalid response:", res);
            return null;
        }

        // Use the media exactly as returned by the API
        const media = event.media ?? [];
        console.log(`✅ Event ${id} fetched successfully, media count:`, media.length);

        return {
            id: event.id,
            name: event.name,
            description: event.description,
            longitude: event.longitude,
            latitude: event.latitude,
            place: event.place,
            date: event.date,
            duration_days: event.duration_days,
            duration_hours: event.duration_hours,
            tickets: event.tickets,
            reserved_tickets: event.reserved_tickets,
            tickets_remaining: event.tickets_remaining,
            price: event.price,
            event_type: event.event_type,
            price_type: event.price_type,
            pre_booking: event.pre_booking,
            is_saved: event.is_saved,
            media,
            status: event.status,
            raw: event,
        };
    } catch (err) {
        console.error("❌ Error fetching event:", err);
        if (err.response) {
            console.error("🚨 Error response:", err.response.data);
        }
        throw err;
    }
};

// Cancel an event
export const cancelEvent = async (id) => {
    try {
        const res = await apiClient.post(`/admin/events/${id}/cancel`, {});
        return res.data;
    } catch (err) {
        console.error("Error canceling event:", err.response?.data || err);
        throw err;
    }
};

// Delete an event
export const deleteEvent = async (id) => {
    try {
        const res = await apiClient.delete(`/events/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error deleting event:", err.response?.data || err);
        throw err;
    }
};

export const updateEvent = async (id, formDataObj = {}) => {
    try {
        console.log("🔄 updateEvent called with id:", id);
        console.log("📦 FormData object:", formDataObj);

        const data = new FormData();

        // Append scalar fields (not arrays of files/urls)
        Object.entries(formDataObj).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                // append Files as images[]
                value.forEach((file) => {
                    if (file instanceof File) {
                        data.append("images[]", file);
                    }
                });
            } else if (key === "old_images" && Array.isArray(value)) {
                // append existing image URLs as old_images[]
                value.forEach((url) => {
                    if (url !== undefined && url !== null) {
                        data.append("old_images[]", url);
                    }
                });
            } else if (value !== undefined && value !== null && !Array.isArray(value)) {
                // scalar values
                data.append(key, value);
            } else if (Array.isArray(value)) {
                // fallback: append array as JSON string (for unexpected arrays)
                data.append(key, JSON.stringify(value));
            }
        });

        // Log all FormData entries before sending (helpful for debugging)
        console.log("📤 Final FormData being sent:");
        for (let [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }

        // POST to the update endpoint (backend expects multipart/form-data)
        console.log(`🌐 Sending POST to /updateEvent/${id}`);
        const res = await apiClient.post(`/updateEvent/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ API Response received:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Error updating event:", err);
        if (err.response) {
            console.error("🚨 Error response:", err.response.data);
            console.error("🚨 Error status:", err.response.status);
        }
        throw err;
    }
};
