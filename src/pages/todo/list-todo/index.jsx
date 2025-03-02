import React, { useState, useEffect } from 'react';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Pagination, Paper, Select, Stack, Typography } from '@mui/material';
import TodoListView from 'components/todo/TodoListView';
import TodoGridView from 'components/todo/TodoGridView';
import TodoDialogView from 'components/todo/TodoDialogView';
import TodoListAccordionView from './TodoListAccordionView';
import TodoListCardView from './TodoListCardView';
import { AppstoreTwoTone, DatabaseTwoTone, TagOutlined } from '@ant-design/icons';
import { TODO_STATUSES } from 'utils/getStatus';

function ListToDo({ canExpandable = true, initialExpanded = true, showPagination = true, showFilter = true, showToggleView = true }) {
  const [expanded, setExpanded] = useState(initialExpanded); // State to control accordion expansion
  const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view

  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null); // State to control selected todo

  const [todoDetailsDialogOpen, setTodoDetailsDialogOpen] = useState(false); // State to control dialog visibility
  const [selectedTab, setSelectedTab] = useState(0);
  const [todoPage, setTodoPage] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      // Example todos
      const exampleTodos = [
        { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Cheese', category_id: 1, status: "TODO" },
        { id: 2, title: 'Workout', description: 'Gym at 6 PM', category_id: 2, status: "IN_PROGRESS" },
        { id: 3, title: 'Read a book', description: 'Finish reading "The Alchemist"', category_id: 3, status: "COMPLETED" },
        { id: 4, title: 'Clean the house', description: 'Vacuum and dust', category_id: 1, status: "CANCELLED" },
      ];
      setTodos(exampleTodos);
    };

    const fetchCategories = async () => {
      // Example categories
      const exampleCategories = [
        { id: 1, name: 'Personal' },
        { id: 2, name: 'Work' },
        { id: 3, name: 'Hobbies' },
      ];
      setCategories(exampleCategories);
    };

    fetchTodos();
    fetchCategories();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAccordionChange = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const handleTodoPageChange = (event, value) => {
    setTodoPage(value);
  };

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setTodoDetailsDialogOpen(true);
  };

  const handleCloseTodoDetailsDialog = () => {
    setTodoDetailsDialogOpen(false);
    setSelectedTodo(null);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const filteredTodos = selectedTab === 0
    ? todos
    : todos.filter(todo => todo.category_id === categories[selectedTab - 1]?.id);

  const paginatedTodos = filteredTodos.slice((todoPage - 1) * 5, todoPage * 5);

  const renderTodos = () => (
    <Box>
      {isGridView ? (
        <TodoGridView
          todos={paginatedTodos}
          selectedTab={selectedTab}
          handleTodoClick={handleTodoClick}
          getCategoryName={getCategoryName}
        />
      ) : (
        <TodoListView
          todos={paginatedTodos}
          selectedTab={selectedTab}
          handleTodoClick={handleTodoClick}
          getCategoryName={getCategoryName}
        />
      )}

      {showPagination && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={Math.ceil(filteredTodos.length / 5)}
            page={todoPage}
            onChange={handleTodoPageChange}
          />
        </Box>
      )}
    </Box>
  );

  return (
    <>

      {
        (showFilter || showToggleView) &&
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 2 }} >
          {
            showFilter &&
            <Stack direction='row' gap={4} alignItems='center'>
              <Stack direction='row' alignItems='center' gap={1}>
                <Typography>
                  Status:
                </Typography>
                <FormControl sx={{ minWidth: '148px' }} variant="outlined">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {Object.entries(TODO_STATUSES).map(([key, { label }]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack direction='row' alignItems='center' gap={1}>
                <Typography>
                  Category:
                </Typography>
                <FormControl sx={{ minWidth: '148px' }} variant="outlined">
                  <Select
                    fullWidth
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories?.map((category, index) => (
                      <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          }

          {
            showToggleView &&
            <IconButton onClick={() => setIsGridView(!isGridView)}>
              {isGridView ? <DatabaseTwoTone /> : <AppstoreTwoTone />}
            </IconButton>
          }
        </Stack>
      }



      {canExpandable ? (
        <TodoListAccordionView
          expanded={expanded}
          handleAccordionChange={handleAccordionChange}
          renderTodos={renderTodos}
        />
      ) : (
        <TodoListCardView
          renderTodos={renderTodos}
        />
      )}

      <TodoDialogView
        selectedTodo={selectedTodo}
        todoDetailsDialogOpen={todoDetailsDialogOpen}
        handleCloseTodoDetailsDialog={handleCloseTodoDetailsDialog}
        categories={categories}
      />
    </>
  );
}

export default ListToDo;