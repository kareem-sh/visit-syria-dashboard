// src/services/users/usersApi.js
import apiClient from '@/services/apiClient';

// Function to get all users
export const getAllUsers = async () => {
    const response = await apiClient.get('/allUser');
    return response.data.users;
};

// Function to get a single user by ID
export const getUserById = async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data.user;
};

// Function to change user status (block/unblock)
export const changeUserStatus = async (statusData) => {
    const response = await apiClient.post('/changeUserStatus', statusData);
    return response.data;
};

// Function to get user activities by type
export const getUserActivities = async (userId, activityType) => {
    const response = await apiClient.get(`/userActivities/${userId}?type=${activityType}`);
    return response.data;
};

// Function to get user posts
export const getUserPosts = async (userId) => {
    const response = await apiClient.get(`/userActivities/${userId}?type=post`);
    return response.data;
};

// Function to get user events
export const getUserEvents = async (userId) => {
    const response = await apiClient.get(`/userActivities/${userId}?type=event`);
    return response.data;
};

// Function to get user trips
export const getUserTrips = async (userId) => {
    const response = await apiClient.get(`/userActivities/${userId}?type=trip`);
    return response.data;
};