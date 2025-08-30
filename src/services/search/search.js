// src/services/search/search.js
import apiClient from '@/services/apiClient';


export const searchData = async (type, sub) => {
    try {
        const response = await apiClient.get('/search', {
            params: {
                type,
                sub
            }
        });

        return response.data.results || [];
    } catch (error) {
        console.error('Search API error:', error);
        throw error;
    }
};