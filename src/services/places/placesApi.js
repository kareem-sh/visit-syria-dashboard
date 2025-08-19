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

// Update a place
export const updatePlace = async (id, formData) => {
    try {
        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "images" && Array.isArray(value)) {
                value.forEach((img, index) => {
                    data.append(`images[${index}]`, img);
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
