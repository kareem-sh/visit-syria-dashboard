import apiClient from "../apiClient.js";

// Create a new place
export const createPlace = async (formData) => {
    try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                value.forEach((img, index) => {
                    data.append(`images[${index}]`, img);
                });
            } else {
                data.append(key, value);
            }
        });
        console.log(data);
        const res = await apiClient.post("/places", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (err) {
        console.error("Error creating place:", err.response?.data || err);
        throw err;
    }
};

export const updatePlace = async (id, formData) => {
    try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                // Handle new image files
                value.forEach((img, index) => {
                    if (img instanceof File) {
                        data.append(`images[${index}]`, img);
                    }
                });
            } else if (key === "old_images" && Array.isArray(value)) {
                // Handle existing image URLs that should be kept
                value.forEach((imgUrl, index) => {
                    data.append(`old_images[${index}]`, imgUrl);
                });
            } else if (value !== undefined && value !== null) {
                data.append(key, value);
            }
        });

        const res = await apiClient.post(`/updatePlace/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return res.data;
    } catch (err) {
        console.error("Error updating place:", err.response?.data || err);
        throw err;
    }
}
// Delete a place
export const deletePlace = async (id) => {
    try {
        const res = await apiClient.delete(`/places/${id}`);
        return res.data;
    } catch (err) {
        console.error("Error deleting place:", err?.response?.data || err);
        throw err;
    }
};

// Get place details by ID
export const getPlaceDetails = async (id) => {
    try {
        const res = await apiClient.get(`/places/${id}`);
        const d = res?.data?.data ?? {};
        return {
            ...d,
            branches: d.number_of_branches,
            classification: d.classification ?? "غير محدد",
            recent_comments: d.recent_comments ?? [],
        };
    } catch (err) {
        console.error("Error fetching place details:", err?.response?.data || err);
        throw err;
    }
};

export const getTopTouristPlaces = async () => {
    try {
        const res = await apiClient.get("/places/top-rated-tourist");
        return (res?.data?.data || []).slice(0, 10);
    } catch (err) {
        console.error("Error fetching tourist places:", err?.response?.data || err);
        throw err;
    }
};

export const getTopRestaurants = async () => {
    try {
        const res = await apiClient.get("/places/top-restaurants");
        return (res?.data?.data || []).slice(0, 10);
    } catch (err) {
        console.error("Error fetching restaurants:", err?.response?.data || err);
        throw err;
    }
};

export const getTopHotels = async () => {
    try {
        const res = await apiClient.get("/places/top-hotels");
        return (res?.data?.data || []).slice(0, 10);
    } catch (err) {
        console.error("Error fetching hotels:", err?.response?.data || err);
        throw err;
    }
};

export const getRestaurantsByCity = async (city) => {
    try {
        const res = await apiClient.get(
            `/places/restaurants/byCity?city=${encodeURIComponent(city)}`
        );
        return (res?.data?.data || []).map((item) => ({
            id: item.id,
            name: item.name,
            branches: item.number_of_branches,
            rating: item.rating,
            description: item.description,
            phone: item.phone,
            location: item.place,
            images: item.images,
        }));
    } catch (err) {
        console.error("Error fetching restaurants by city:", err?.response?.data || err);
        throw err;
    }
};

export const getHotelsByCity = async (city) => {
    try {
        const res = await apiClient.get(`/places/hotels/byCity?city=${encodeURIComponent(city)}`);
        return (res?.data?.data || []).map((item) => ({
            id: item.id,
            name: item.name,
            branches: item.number_of_branches,
            rating: item.rating,
            description: item.description,
            phone: item.phone,
            location: item.place,
            images: item.images,
        }));
    } catch (err) {
        console.error("Error fetching hotels by city:", err?.response?.data || err);
        throw err;
    }
};

export const getTouristPlacesByCity = async (city) => {
    try {
        const res = await apiClient.get(`/places/tourist/byCity?city=${encodeURIComponent(city)}`);
        return (res?.data?.data || []).map((item) => ({
            id: item.id,
            name: item.name,
            type: item.classification || "غير محدد",
            rating: item.rating,
            description: item.description,
            location: item.place,
            images: item.images,
            rank: item.rank,
        }));
    } catch (err) {
        console.error("Error fetching tourist places by city:", err?.response?.data || err);
        throw err;
    }
};

export const getPlaceCountsByCity = async (city) => {
    try {
        const [restaurants, hotels, touristPlaces] = await Promise.all([
            getRestaurantsByCity(city),
            getHotelsByCity(city),
            getTouristPlacesByCity(city),
        ]);

        return {
            restaurants: restaurants.length,
            hotels: hotels.length,
            touristPlaces: touristPlaces.length,
        };
    } catch (err) {
        console.error("Error fetching place counts:", err);
        throw err;
    }
};
export const setSave = async (id) => {
    try {
        const res = await apiClient.post(`/saves/${id}?type=place`);
        return res.data;
    } catch (err) {
        console.error("Error saving place:", err?.response?.data || err);
        throw err;
    }
};

// Remove saved place (admin)
export const deleteSave = async (id) => {
    try {
        const res = await apiClient.delete(`/saves/${id}?type=place`);
        return res.data;
    } catch (err) {
        console.error("Error removing saved place:", err?.response?.data || err);
        throw err;
    }
};

// Update your getSavedItems function in placesApi.js
export const getSavedItems = async (type) => {
    try {
        const res = await apiClient.get(`/saves?type=${type}`);

        console.log(`Saved items for ${type}:`, res.data);

        // Extract the saves array from the response
        const savesData = res.data.saves || [];

        // Format the data based on type
        return savesData.map(item => {
            const baseItem = {
                id: item.id,
                name: item.name,
                rating: item.rating || 0,
                type: item.type || type,
                city: item.city || 'دمشق', // Default to Damascus if not provided
            };

            // Add type-specific properties
            if (type === 'hotel' || type === 'restaurant') {
                return {
                    ...baseItem,
                    branches: item.branches || item.number_of_branches || 0,
                };
            } else if (type === 'tourist') {
                return {
                    ...baseItem,
                    classification: item.classification || 'غير محدد',
                };
            }

            return baseItem;
        });
    } catch (err) {
        console.error("Error fetching saved items:", err?.response?.data || err);
        throw new Error(err.response?.data?.message || "فشل في تحميل العناصر المحفوظة");
    }
};