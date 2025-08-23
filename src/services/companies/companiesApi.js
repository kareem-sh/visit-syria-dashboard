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
                // Handle the single image file
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
        return res.data.companies || []; // Return only the companies array
    } catch (err) {
        console.error("Error fetching companies on hold:", err.response?.data || err);
        throw err;
    }
};

export const changeCompanyStatus = async (companyId, status, reason = null) => {
    try {
        const requestData = {
            company_id: companyId,
            status: status
        };

        // Add reason only if provided (for reject case)
        if (reason) {
            requestData.reason = reason;
        }

        const res = await apiClient.post("/changeCompanyStatus", requestData);
        return res.data;
    } catch (err) {
        console.error("Error changing company status:", err.response?.data || err);
        throw err;
    }
};