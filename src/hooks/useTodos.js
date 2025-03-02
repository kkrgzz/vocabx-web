import { useState, useEffect } from 'react';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      // Replace with actual API calls
      const exampleTodos = [
        { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Cheese', category_id: 1, status: "TODO" },
        { id: 2, title: 'Workout', description: 'Gym at 6 PM', category_id: 2, status: "IN_PROGRESS" },
        { id: 3, title: 'Read a book', description: 'Finish reading "The Alchemist"', category_id: 3, status: "COMPLETED" },
        { id: 4, title: 'Clean the house', description: 'Vacuum and dust', category_id: 1, status: "CANCELLED" },
      ];
      
      const exampleCategories = [
        { id: 1, name: 'Personal' },
        { id: 2, name: 'Work' },
        { id: 3, name: 'Hobbies' },
      ];

      setTodos(exampleTodos);
      setCategories(exampleCategories);
    };

    fetchInitialData();
  }, []);

  const updateTodo = (updatedTodo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  return {
    todos,
    categories,
    updateTodo,
    getCategoryName: (categoryId) => 
      categories.find(cat => cat.id === categoryId)?.name || ''
  };
};