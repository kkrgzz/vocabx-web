import axios from 'utils/axios';


export const getMoods = async ({ count = 5 }) => {
    let apiEndpoint = '/api/moods/latest';
    try {
        const response = await axios.get(apiEndpoint, {
            params: {
                count,
            }
        });
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching moods:', error);
        return [];
    }
};