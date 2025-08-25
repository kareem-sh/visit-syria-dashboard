    import apiClient from '@/services/apiClient';

    // Fetch common questions (FAQs)
    export const getCommonQuestions = async () => {
        const response = await apiClient.get('settings/type/common_question');
        return response.data;
    };

    // Fetch privacy policy content
    export const getPrivacyAndPolicy = async () => {
        const response = await apiClient.get('settings/type/privacy_policy');
        return response.data;
    };


    // Create a new setting
    export const createSetting = async (settingData) => {
        const response = await apiClient.post('settings', settingData);
        return response.data;
    };

    // Update an existing setting
    export const updateSetting = async (id, settingData) => {
        const response = await apiClient.post(`settings/${id}`, settingData);
        return response.data;
    };

    // Delete a setting
    export const deleteSetting = async (id) => {
        const response = await apiClient.delete(`settings/${id}`);
        return response.data;
    };