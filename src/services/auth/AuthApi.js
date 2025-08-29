import apiClient from "@/services/apiClient.js";

// User login - accept FormData object
export const login = async (formData) => {
    try {
        const response = await apiClient.post("/auth/login", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Login Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};


export const register = async (formData) => {
    try {
        const response = await apiClient.post("/auth/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Registration Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};


export const verify = async (formData) => {
    try {
        const response = await apiClient.post("/auth/verifyEmail", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Verification Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Verification Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};

export const resendVerification = async (formData) => {
    try {
        const response = await apiClient.post("/auth/resendVerificationCode", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Resend Verification Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Resend Verification Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};

export const forgotPassword = async (formData) => {
    try {
        const response = await apiClient.post("/auth/forgetPassword", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Forgot Password Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Forgot Password Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};

export const resetPassword = async (formData) => {
    try {
        const response = await apiClient.post("/auth/resetPassword", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Reset Password Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Reset Password Error:", error.response?.data || error.message);
        // Re-throw the error so React Query can catch it
        throw error;
    }
};

export const getUserRoleAndData = async (token) => {
    try {
        const response = await apiClient.get("/getRole", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Role and Data Success:", response.data);

        // Process the response based on role
        const { role, user } = response.data;

        if (role === "super_admin") {
            // For super_admin, we only need role and email
            return {
                role: role,
                email: user.email,
                id: user.id
            };
        } else if (role === "admin") {
            // For admin, we need all the user data
            return {
                role: role,
                ...user.user, // The user object inside user
                company: user // The company data
            };
        } else if (role === null) {
            // For users with null role (pending approval), return all user data
            return {
                role: null,
                ...user, // Spread all user properties
                id: user.id,
                email: user.email,
                // Include any other relevant user data
                status: user.status,
                is_verified: user.is_verified
            };
        } else {
            // For any other role or no role, return the basic user data
            return {
                role: role || null, // Ensure role is never undefined
                ...user,
                id: user.id,
                email: user.email
            };
        }

    } catch (error) {
        console.error("Role and Data Error:", error.response?.data || error.message);

        // Check if it's an authentication error
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Clear any invalid tokens from storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            // Throw a specific error that can be handled by the caller
            throw new Error("Authentication failed: Invalid or expired token");
        }

        throw error;
    }
};

// AuthApi.js - Add this function to your existing auth API file
export const logoutUser = async () => {
    try {
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.log("No token found, skipping server logout");
            return;
        }

        const response = await apiClient.post("/auth/logout", {}, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Logout Success:", response.data);
        return response.data;
    } catch (error) {
        console.error("Logout Error:", error.response?.data || error.message);

    }
}


export const createCompany = async (formData) => {
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
        const res = await apiClient.post("/auth/setAdminProfile", data, {
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