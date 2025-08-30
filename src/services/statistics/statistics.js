// services/statistics.js
import apiClient from "@/services/apiClient";

/**
 * Get earnings statistics for super admin
 * @returns {Promise} Promise with earnings data
 */
export const getEarning = () => {
    return apiClient.get('/superAdmin/getEarning');
};

/**
 * Get user statistics for super admin
 * @returns {Promise} Promise with user data
 */
export const getUser = () => {
    return apiClient.get('/superAdmin/getUser');
};

/**
 * Get rating statistics for super admin
 * @returns {Promise} Promise with rating data
 */
export const getRating = () => {
    return apiClient.get('/superAdmin/getRating');
};

/**
 * Get earnings for this year for super admin
 * @returns {Promise} Promise with this year's earnings data
 */
export const earningThisYearSA = () => {
    return apiClient.get('/earningThisYearSA');
};

/**
 * Get top companies by criteria (trip, earning, etc.)
 * @param {string} by - The criteria to sort by (trip, earning, etc.)
 * @returns {Promise} Promise with top companies data
 */
export const topCompanies = (by = 'trip') => {
    return apiClient.get(`/topCompanies?by=${by}`);
};

/**
 * Get top places (restaurants, hotels, tourist sites)
 * @returns {Promise} Promise with top places data
 */
export const getTopPlaces = () => {
    return apiClient.get('/getTopPlaces');
};

// You can also add a combined function if needed
/**
 * Get all statistics for super admin dashboard
 * @returns {Promise} Promise with all statistics data
 */
export const getAllStatistics = () => {
    return Promise.all([
        getEarning(),
        getUser(),
        getRating(),
        earningThisYearSA(),
        topCompanies('trip'), // Default to trip for dashboard
        getTopPlaces()
    ]).then(([earning, user, rating, earningThisYear, topCompanies, topPlaces]) => ({
        earning: earning.data,
        user: user.data,
        rating: rating.data,
        earningThisYear: earningThisYear.data,
        topCompanies: topCompanies.data,
        topPlaces: topPlaces.data
    }));
};

export default {
    getEarning,
    getUser,
    getRating,
    earningThisYearSA,
    topCompanies,
    getTopPlaces,
    getAllStatistics
};