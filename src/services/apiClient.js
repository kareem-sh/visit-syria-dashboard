// services/apiClient.js
import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "ar",
    },
});

// Add request interceptor to dynamically set the token
apiClient.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage
        const token = localStorage.getItem('authToken');

        // If no token in localStorage, check if we have the hardcoded token
        if (!token) {
            const hardcodedToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTUwOTYwNzksIm5iZiI6MTc1NTA5NjA3OSwianRpIjoiTEdYR0xJWHNaRTJqNUE3cCIsInN1YiI6IjUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7J1dXwsgS_yN9MqfNQQhDJT_2KZhYs_2Ox5YvoIVFM0';

            // Store the hardcoded token in localStorage for future use
            localStorage.setItem('authToken', hardcodedToken);
            config.headers.Authorization = `Bearer ${hardcodedToken}`;
        } else {
            // Use the token from localStorage
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token is expired or invalid
            console.error('Authentication failed, removing token');
            localStorage.removeItem('authToken');
            // You can redirect to login page here if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;