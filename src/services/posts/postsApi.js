// src/services/posts/postsApi.js
import apiClient from '@/services/apiClient';

// Function to get all posts with optional status filtering
export const getPosts = async () => {
    let url = '/posts/by-status';

    const response = await apiClient.get(url);
    return response.data;
};

// Function to get top active users
export const getTopActiveUsers = async () => {
    const response = await apiClient.get('/users/top-active');
    return response.data;
};

// Function to update post status
export const updatePostStatus = async (postId, status) => {
    const response = await apiClient.post('/posts/status', {
        post_id: postId,
        status: status
    });
    return response.data;
};

export const getPostById = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data.data; // Extract the nested data
};
