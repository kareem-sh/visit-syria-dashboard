// services/trips/trips.js
import apiClient from '@/services/apiClient';

export const getTrips = async (tag = "الكل") => {
    console.time('getTrips API Call');
    try {
        const response = await apiClient.get(`/trips?tag=${encodeURIComponent(tag)}`);
        console.timeEnd('getTrips API Call');
        console.log('API Response size:', JSON.stringify(response.data).length, 'bytes');
        return response.data;
    } catch (error) {
        console.timeEnd('getTrips API Call');
        console.error('Error in getTrips:', error);
        throw error;
    }
};

// Updated function to handle the different response structure
export const getTripById = async (id) => {
    console.time('getTripById API Call');
    try {
        const response = await apiClient.get(`/trips/${id}`);
        console.timeEnd('getTripById API Call');

        // Extract the trip object from the response
        return response.data.trip; // ← This is the key fix!
    } catch (error) {
        console.timeEnd('getTripById API Call');
        console.error('Error in getTripById:', error);
        throw error;
    }
};

// New function to get trips by company ID with optional tag filter
export const getTripsByCompanyId = async (companyId, tag = "الكل") => {
    console.time('getTripsByCompanyId API Call');
    try {
        // Build query parameters
        const params = {};
        if (tag && tag !== "الكل") {
            params.tag = tag;
        }

        const response = await apiClient.get(`/trip/company/${companyId}`, {
            params: params
        });

        console.timeEnd('getTripsByCompanyId API Call');
        console.log('API Response size:', JSON.stringify(response.data).length, 'bytes');

        return response.data;
    } catch (error) {
        console.timeEnd('getTripsByCompanyId API Call');
        console.error('Error in getTripsByCompanyId:', error);
        throw error;
    }
};