import apiClient from "@/services/apiClient.js";

// Get all articles
export const getArticles = async (params = {}) => {
    const response = await apiClient.get('/articles', { params });
    return response.data;
};

// Get single article by ID
export const getArticleById = async (id) => {
    const response = await apiClient.get(`/articles/${id}`);
    return response.data;
};

// Create new article
export const createArticle = async (articleData) => {
    // Prepare form data for file upload
    const formData = new FormData();

    // Append basic fields
    formData.append('title', articleData.title);
    formData.append('body', articleData.body);

    // Append image if provided
    if (articleData.image && articleData.image instanceof File) {
        formData.append('image', articleData.image);
    }

    // Append tags as individual fields (tags[0], tags[1], etc.)
    if (articleData.tags && Array.isArray(articleData.tags)) {
        articleData.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
    }

    const response = await apiClient.post('/articles', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Update article by ID
export const updateArticle = async (id, articleData) => {
    // Prepare form data for file upload
    const formData = new FormData();

    // Append basic fields if provided
    if (articleData.title) formData.append('title', articleData.title);
    if (articleData.body) formData.append('body', articleData.body);

    // Handle image: if new image uploaded, append it
    if (articleData.image && articleData.image instanceof File) {
        formData.append('image', articleData.image);
    } else if (articleData.keepExistingImage) {
        // Send a flag to indicate we want to keep the existing image
        formData.append('keep_existing_image', 'true');
    }

    // Append tags as individual fields if provided
    if (articleData.tags && Array.isArray(articleData.tags)) {
        articleData.tags.forEach((tag, index) => {
            formData.append(`tags[${index}]`, tag);
        });
    }

    // Use PUT method for update if your API supports it
    const response = await apiClient.post(`/articles/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete Single Article
export const deleteArticle = async (id) => {
    const response = await apiClient.delete(`/articles/${id}`);
    return response.data;
};