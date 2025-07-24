import axios from "./axiosInstance";

export const getSuperAdminStats = () => axios.get("/superadmin/stats");
