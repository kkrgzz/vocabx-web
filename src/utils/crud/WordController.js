import axios from 'utils/axios';

export const getWords = async ({ page = 1, perPage = 10, sort = 'asc', language_code = null }) => {
    let apiEndpoint = '/api/user/words';
    try {
        const response = await axios.get(apiEndpoint, {
            params: {
                page,
                perPage,
                sort,
                language_code
            }
        });
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
};