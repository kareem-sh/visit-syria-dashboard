import apiClient from '@/services/apiClient';

export const getTrips = async (tag = "الكل") => {
    try {
        const url = `/trips?tag=${tag}`;
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTripById = async (id) => {
    try {
        const response = await apiClient.get(`/trips/${id}`);
        return response.data.trip;
    } catch (error) {
        throw error;
    }
};

export const getTripsByCompanyId = async (companyId, tag = "الكل") => {
    try {
        const params = {};
        if (tag && tag !== "الكل") {
            params.tag = tag;
        }

        const response = await apiClient.get(`/trip/company/${companyId}`, {
            params: params
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};


export const createTrip = async (trip, options = {}) => {
    const { onProgress, url = '/trips' } = options;

    try {
        const formData = new FormData();

        // --- Scalars (exclude discount, handled separately)
        const scalars = ['name', 'description', 'season', 'start_date', 'tickets', 'price'];
        scalars.forEach(k => {
            if (trip[k] !== undefined && trip[k] !== null && trip[k] !== '') {
                formData.append(k, String(trip[k]));
            }
        });

        // --- Discount (only 'discount' key)
        const discountEnabled = Boolean(trip.discount_enabled);
        const discountToSend = discountEnabled
            ? (trip.discount !== undefined && trip.discount !== null && trip.discount !== '' ? String(trip.discount) : '0')
            : '0';
        formData.append('discount', discountToSend);

        // --- Tags (tags[])
        if (Array.isArray(trip.tags)) {
            trip.tags.forEach(tag => {
                if (tag !== undefined && tag !== null) formData.append('tags[]', String(tag));
            });
        }

        // --- Images: Handle images as files with index
        if (Array.isArray(trip.images)) {
            trip.images.forEach((image, index) => {
                if (image instanceof File || image instanceof Blob) {
                    formData.append(`images[${index}]`, image);
                }
            });
        }

        // --- Timelines: Handle in the exact format required
        if (Array.isArray(trip.timelines)) {
            trip.timelines.forEach((timeline, timelineIndex) => {
                // Add day for each timeline
                if (timeline.day !== undefined && timeline.day !== null) {
                    formData.append(`timelines[${timelineIndex}][day]`, String(timeline.day));
                }

                // Add sections for each timeline
                if (Array.isArray(timeline.sections)) {
                    timeline.sections.forEach((section, sectionIndex) => {
                        // Time
                        if (section.time !== undefined && section.time !== null) {
                            formData.append(`timelines[${timelineIndex}][sections][${sectionIndex}][time]`, String(section.time));
                        }

                        // Title
                        if (section.title !== undefined && section.title !== null) {
                            formData.append(`timelines[${timelineIndex}][sections][${sectionIndex}][title]`, String(section.title));
                        }

                        // Description (array of lines)
                        if (Array.isArray(section.description)) {
                            section.description.forEach((line, descIndex) => {
                                if (line !== undefined && line !== null && line !== '') {
                                    formData.append(`timelines[${timelineIndex}][sections][${sectionIndex}][description][${descIndex}]`, String(line));
                                }
                            });
                        }

                        // Latitude
                        if (section.latitude !== undefined && section.latitude !== null) {
                            formData.append(`timelines[${timelineIndex}][sections][${sectionIndex}][latitude]`, String(section.latitude));
                        }

                        // Longitude
                        if (section.longitude !== undefined && section.longitude !== null) {
                            formData.append(`timelines[${timelineIndex}][sections][${sectionIndex}][longitude]`, String(section.longitude));
                        }
                    });
                }
            });
        }

        // --- days scalar
        if (trip.days !== undefined && trip.days !== null) {
            formData.append('days', String(trip.days));
        }

        // --- Improvements: only if trip has the key
        if (Object.prototype.hasOwnProperty.call(trip, 'improvements')) {
            const toAppend = [];

            if (Array.isArray(trip.improvements)) {
                trip.improvements.forEach(item => {
                    if (item !== undefined && item !== null && String(item).trim() !== '') {
                        toAppend.push(String(item).trim());
                    }
                });
            } else if (typeof trip.improvements === 'string') {
                trip.improvements.split('\n').forEach(line => {
                    const v = String(line).trim();
                    if (v !== '') toAppend.push(v);
                });
            } else if (trip.improvements != null) {
                const v = String(trip.improvements).trim();
                if (v !== '') toAppend.push(v);
            }

            toAppend.forEach(item => formData.append('improvements[]', item));
        }

        // --- Axios config (progress optional)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: progressEvent => {
                if (onProgress && progressEvent.lengthComputable) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percent);
                }
            }
        };

        // Debug: Log FormData contents
        console.log('📦 FormData contents:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: File (${value.name}, ${value.type}, ${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        const response = await apiClient.post(url, formData, config);
        return response.data;
    } catch (error) {
        console.error('❌ Error in createTrip:', error.response?.data || error);
        throw error;
    }
};



export const tripBookings = async (tripId) => {
    try {
        const res = await apiClient.get(`/persons/book/${tripId}?type=trip`);
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
        console.error("Error fetching trip bookings:", err.response?.data || err);
        throw err;
    }
};
