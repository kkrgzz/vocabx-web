import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'utils/axios';

export const getTodoCategories = async () => {
    let apiEndpoint = '/api/todo-categories';
    try {
        const response = await axios.get(apiEndpoint);
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching todo categories:', error);
        return [];
    }
}

const createTodoCategory = async (newCategory) => {
    const response = await axios.post('/api/todo-categories', newCategory);
    return response?.data || {};
}

export const useCreateTodoCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(createTodoCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries(['todoCategories']);
        }
    })
} 