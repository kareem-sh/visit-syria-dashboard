import apiClient from "@/services/apiClient.js";

export const getMonthlyRating = async () => {
    try {
        const response = await apiClient.get('/supports/monthly-ratings');
        return response.data;
    } catch (error) {
        console.error('Error fetching available months rates', error);
    }
}

export const getSupportsByCategory = async (category) => {
    try {
        const response = await apiClient.get('/supports', {
            params: {
                category: category
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching supports by category', error);
        throw error;
    }
}