import axios from 'utils/axios';

export const getTodos = async ({ page = 1, perPage = 10, sort = 'asc', status = 'ALL', category = 'ALL' }) => {
    let apiEndpoint = '/api/todos';
    const params = {
        page,
        perPage,
        sort,
    };

    if (status !== 'ALL') {
        params.status = status;
    }

    if (category !== 'ALL') {
        params.category_id = category;
    }

    try {
        const response = await axios.get(apiEndpoint, { params });
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};