import axios from 'utils/axios';

export const getUserInformation = async () => {
    let apiEndpoint = '/api/account/me';
    try {
        const response = await axios.get(apiEndpoint);
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching user data:', error);
        return [];
    }
};

