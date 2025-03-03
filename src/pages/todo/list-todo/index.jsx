import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, FormControl, IconButton, MenuItem, Pagination, Select, Skeleton, Stack, Typography } from '@mui/material';
import TodoListView from 'components/todo/TodoListView';
import TodoGridView from 'components/todo/TodoGridView';
import TodoDialogView from 'components/todo/TodoDialogView';
import TodoListAccordionView from './TodoListAccordionView';
import TodoListCardView from './TodoListCardView';
import { AppstoreTwoTone, DatabaseTwoTone } from '@ant-design/icons';
import { TODO_STATUSES } from 'utils/getStatus';
import { useQuery } from '@tanstack/react-query';
import { getTodoCategories } from 'utils/crud/TodoCategoryController';
import { getTodos } from 'utils/crud/TodoController';

function ListToDo({ canExpandable = true, initialExpanded = true, showPagination = true, showFilter = true, showToggleView = true }) {
  const [expanded, setExpanded] = useState(initialExpanded); // State to control accordion expansion
  const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view
  const [selectedTodo, setSelectedTodo] = useState(null); // State to control selected todo
  const [todoDetailsDialogOpen, setTodoDetailsDialogOpen] = useState(false); // State to control dialog visibility

  const [todoPage, setTodoPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data: todoCategories, isLoading: isTodoCategoriesLoading } = useQuery({
    queryKey: ['todoCategories'],
    queryFn: async () => getTodoCategories(),
  });

  const { data: todos, isLoading: isTodosLoading } = useQuery({
    queryKey: ['todos', todoPage, categoryFilter, statusFilter],
    queryFn: async () => getTodos({ page: todoPage, perPage: 10, sort: 'asc', category: categoryFilter, status: statusFilter }),
  });

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
    const category = todoCategories?.find(cat => cat.id === categoryId);
    return category ? category.title : '';
  };

  const renderTodos = () => (

    <Box>
      {(!isTodosLoading && !isTodoCategoriesLoading) ? (
        <Box>
          {isGridView ? (
            <TodoGridView
              todos={todos?.data}
              handleTodoClick={handleTodoClick}
              getCategoryName={getCategoryName}
            />
          ) : (
            <TodoListView
              todos={todos?.data}
              handleTodoClick={handleTodoClick}
              getCategoryName={getCategoryName}
            />
          )}
        </Box>
      ) : (
        <Box>
          <Skeleton animation="wave" variant="rounded" height={30} sx={{ my: 2 }} />
        </Box>
      )}



      {showPagination && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={todos?.last_page}
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
                    <MenuItem value='ALL'>All</MenuItem>
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
                    <MenuItem value='ALL'>All</MenuItem>
                    {!isTodoCategoriesLoading && todoCategories?.map((category, index) => (
                      <MenuItem key={index} value={category.id}>{category.title}</MenuItem>
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

      {
        !isTodoCategoriesLoading &&
        <TodoDialogView
          selectedTodo={selectedTodo}
          todoDetailsDialogOpen={todoDetailsDialogOpen}
          handleCloseTodoDetailsDialog={handleCloseTodoDetailsDialog}
          categories={todoCategories}
        />
      }
    </>
  );
}

export default ListToDo;