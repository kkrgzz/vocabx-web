import axios from 'utils/axios';

export const getLanguages = async () => {
    try {
        const response = await axios.get('/api/languages');
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching languages:', error);
        return [];
    }
};