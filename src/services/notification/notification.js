// src/services/notification/notification.js
import apiClient from '@/services/apiClient';


export const sendNotificationBySA = (category, title, description) => {
    // Create FormData object
    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('description', description);

    return apiClient.post('/sendNotificationBySA', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const destroyNotification = (notificationId) => {
    return apiClient.delete(`/destroyNotification/${notificationId}`);
};


export const getAllReadNotifications = () => {
    return apiClient.get('/getAllNotifications/read');
};


export const getAllUnreadNotifications = () => {
    return apiClient.get('/getAllNotifications/unread');
};