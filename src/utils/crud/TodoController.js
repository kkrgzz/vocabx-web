import axios from 'utils/axios';

export const getTodos = async ({ page = 1, perPage = 10, sort = 'asc' }) => {
    let apiEndpoint = '/api/todos';
    try {
        const response = await axios.get(apiEndpoint, {
            params: {
                page,
                perPage,
                sort
            }
        });
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
}