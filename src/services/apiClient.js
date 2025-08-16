import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NTUwOTYwNzksIm5iZiI6MTc1NTA5NjA3OSwianRpIjoiTEdYR0xJWHNaRTJqNUE3cCIsInN1YiI6IjUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.7J1dXwsgS_yN9MqfNQQhDJT_2KZhYs_2Ox5YvoIVFM0`,
        "Accept-Language": "ar",
    },
});

export default apiClient;
