    import apiClient from '@/services/apiClient';

    export const getCommonQuestions = async (category) => {
        if (category) {
            const response = await apiClient.get('settings/type/common_question', {
                params: { category }
            });
            return response.data;
        } else {
            const response = await apiClient.get('settings/type/common_question');
            return response.data;
        }
    };

    export const getPrivacyAndPolicy = async (category) => {
        if (category) {
            const response = await apiClient.get('settings/type/privacy_policy', {
                params: { category }
            });
            return response.data;
        } else {
            const response = await apiClient.get('settings/type/privacy_policy');
            return response.data;
        }
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