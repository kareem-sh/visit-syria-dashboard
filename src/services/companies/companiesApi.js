import apiClient from "@/services/apiClient";

export const createCompanyByAdmin = async (formData) => {
    try {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "documents" && Array.isArray(value)) {
                value.forEach((doc, index) => {
                    data.append(`documents[${index}]`, doc.file || doc);
                });
            } else if (key === "image" && value) {
                data.append(key, value);
            } else if (value !== undefined && value !== null) {
                data.append(key, value);
            }
        });
        const res = await apiClient.post("/auth/registerCompanyBySuperAdmin", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    } catch (err) {
        console.error("Error creating company:", err.response?.data || err);
        throw err;
    }
};

export const getCompaniesOnHold = async () => {
    try {
        const res = await apiClient.get("/getCompaniesOnHold");
        return res.data.companies || [];
    } catch (err) {
        console.error("Error fetching companies on hold:", err.response?.data || err);
        throw err;
    }
};

export const getAllCompanies = async (params = {}) => {
    try {
        const res = await apiClient.get("/companies", {
            params: params
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching all companies:", err.response?.data || err);
        throw err;
    }
};

export const getCompanyById = async (companyId) => {
    try {
        const res = await apiClient.get(`/showCompany/${companyId}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching company by ID:", err.response?.data || err);
        throw err;
    }
};

export const changeCompanyStatus = async (companyId, status, reason = null) => {
    try {
        const requestData = {
            company_id: companyId,
            status: status
        };

        // Add reason only if provided (for status changes that require reason)
        if (reason) {
            requestData.reason = reason;
        }

        console.log('Changing company status:', requestData);

        const res = await apiClient.post("/changeCompanyStatus", requestData);
        console.log('Status change response:', res.data);

        return res.data;
    } catch (err) {
        console.error("Error changing company status:", err.response?.data || err);
        throw err;
    }
};

// Get earnings for the current year (per month)
export const getEarningsThisYear = async () => {
    try {
        const res = await apiClient.get("/earningThisYearA");
        return res.data;
    } catch (err) {
        console.error("Error fetching earnings data:", err.response?.data || err);
        throw err;
    }
};

// Get ratings for the current year (per month)
export const getRatingsThisYear = async () => {
    try {
        const res = await apiClient.get("/ratingThisYearA");
        return res.data;
    } catch (err) {
        console.error("Error fetching ratings data:", err.response?.data || err);
        throw err;
    }
};