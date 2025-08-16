import apiClient from "../apiClient.js";

// Get all events
export const getEvents = async () => {
    const res = await apiClient.get("/admin/events");

    const eventsArray = res?.data?.data;
    if (!eventsArray) {
        console.error("API response invalid:", res);
        return [];
    }

    return eventsArray.map((event) => ({
        id: event.id,
        eventName: event.name,
        date: event.date ? new Date(event.date).toLocaleDateString("en-GB") : "-",
        duration: `${event.duration_days || 0} أيام`,
        location: event.place
            ? event.place.length > 30
                ? event.place.slice(0, 25) + "..."
                : event.place
            : "-",
        tickets_count: event.tickets || 0,
        ticket_price: event.price_type === "free" ? "مجاني" : `${event.price} $`,
        status: event.status,
    }));
};

// Create a new event
export const createEvent = async (formData) => {
    try {
        const data = new FormData();

        // Append all fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images") {
                value.forEach((img, index) => {
                    data.append(`images[${index}]`, img);
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
