import axios from "axios";

let baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "ar",
    },
});

// Keep token in memory (safer than always reading localStorage)
let authToken = null;

export const setAPIToken = (token) => {
    authToken = token;
};

export const clearAPIToken = () => {
    authToken = null;
};

// Interceptor: attach latest token
apiClient.interceptors.request.use(
    (config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
