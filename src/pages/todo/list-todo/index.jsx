import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Grid, Card, CardContent, List, ListItemButton, ListItemText, IconButton, CardActionArea, Chip, Accordion, AccordionSummary, AccordionDetails, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DownOutlined, AppstoreTwoTone, DatabaseTwoTone } from '@ant-design/icons';
import MainCard from 'components/MainCard';

function ListToDo({ canExpandable = true, initialExpanded = true, showPagination = true }) {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'Completed' },
    { id: 4, title: 'Cancelled' }
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isGridView, setIsGridView] = useState(false); // State to toggle between grid and list view
  const [expanded, setExpanded] = useState(initialExpanded); // State to control accordion expansion
  const [todoPage, setTodoPage] = useState(1);
  const [selectedTodo, setSelectedTodo] = useState(null); // State to control selected todo
  const [todoDetailsDialogOpen, setTodoDetailsDialogOpen] = useState(false); // State to control dialog visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to control edit mode
  const [editedTitle, setEditedTitle] = useState(''); // State to control edited title
  const [editedDescription, setEditedDescription] = useState(''); // State to control edited description
  const [editedStatus, setEditedStatus] = useState(''); // State to control edited status
  const [editedCategory, setEditedCategory] = useState(''); // State to control edited category

  useEffect(() => {
    const fetchTodos = async () => {
      // Example todos
      const exampleTodos = [
        { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Cheese', category_id: 1, status_id: 1 },
        { id: 2, title: 'Workout', description: 'Gym at 6 PM', category_id: 2, status_id: 2 },
        { id: 3, title: 'Read a book', description: 'Finish reading "The Alchemist"', category_id: 3, status_id: 3 },
        { id: 4, title: 'Clean the house', description: 'Vacuum and dust', category_id: 1, status_id: 4 },
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
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setEditedStatus(todo.status_id);
    setEditedCategory(todo.category_id);
    setTodoDetailsDialogOpen(true);
  };

  const handleCloseTodoDetailsDialog = () => {
    setTodoDetailsDialogOpen(false);
    setSelectedTodo(null);
    setIsEditMode(false);
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleSaveButtonClick = () => {
    // Update the todo with the edited details
    const updatedTodos = todos.map(todo =>
      todo.id === selectedTodo.id ? { ...todo, title: editedTitle, description: editedDescription, status_id: editedStatus, category_id: editedCategory } : todo
    );
    setTodos(updatedTodos);
    setIsEditMode(false);
    setTodoDetailsDialogOpen(false);
  };

  const handleStatusChange = (todoId, newStatusId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, status_id: newStatusId } : todo
    );
    setTodos(updatedTodos);
    if (selectedTodo && selectedTodo.id === todoId) {
      setSelectedTodo(prev => ({ ...prev, status_id: newStatusId }));
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const getStatusTitle = (statusId) => {
    const status = statuses.find(stat => stat.id === statusId);
    return status ? status.title : '';
  };

  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return '#F6F193'; // Yellow
      case 2:
        return '#D2E0FB'; // Blue
      case 3:
        return '#B5F1CC'; // Green
      case 4:
        return '#FF9B9B'; // Red
      default:
        return '#ffffff'; // Default white
    }
  };

  const filteredTodos = selectedTab === 0
    ? todos
    : todos.filter(todo => todo.category_id === categories[selectedTab - 1]?.id);

  const paginatedTodos = filteredTodos.slice((todoPage - 1) * 5, todoPage * 5);

  const renderList = () => (
    <Box sx={{ p: 3 }}>
      {isGridView ? (
        <Grid container spacing={2}>
          {paginatedTodos.map(todo => (
            <Grid item xs={12} sm={6} md={4} key={todo.id}>
              <Card sx={{ '&:hover': { boxShadow: 6 }, backgroundColor: getStatusColor(todo.status_id) }}>
                <CardActionArea onClick={() => handleTodoClick(todo)}>
                  <CardContent>
                    <Typography variant="h6">{todo.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{todo.description}</Typography>
                    {selectedTab === 0 && (
                      <Chip label={getCategoryName(todo.category_id)} sx={{ mt: 1 }} />
                    )}
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Status: {getStatusTitle(todo.status_id)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center">
          <List sx={{ width: '100%', maxWidth: 600 }}>
            {paginatedTodos.map(todo => (
              <ListItemButton
                key={todo.id}
                onClick={() => handleTodoClick(todo)}
                sx={{
                  backgroundColor: getStatusColor(todo.status_id), // Add background color based on status
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  },
                  borderRadius: 1,
                  mb: 1,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Add shadow for better distinction
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={9}>
                    <ListItemText
                      primary={todo.title}
                      secondary={todo.description}
                    />
                  </Grid>
                  {selectedTab === 0 && (
                    <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { sm: 'start', md: 'end' }, alignItems: 'center' }}>
                      <Chip label={getCategoryName(todo.category_id)} sx={{ mt: 1 }} />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Status: {getStatusTitle(todo.status_id)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItemButton>
            ))}
          </List>
        </Box>
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
      {canExpandable ? (
        <Accordion expanded={expanded} onChange={(event, isExpanded) => handleAccordionChange(isExpanded)}>
          <AccordionSummary
            expandIcon={<DownOutlined />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Todo List
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="todo categories">
                <Tab label="All Todos" />
                {categories.map((category, index) => (
                  <Tab key={category.id} label={category.name} />
                ))}
              </Tabs>
              <IconButton onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? <DatabaseTwoTone /> : <AppstoreTwoTone />}
              </IconButton>
            </Box>
            {renderList()}
          </AccordionDetails>
        </Accordion>
      ) : (
        <>
          <MainCard>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="todo categories">
                <Tab label="All Todos" />
                {categories.map((category, index) => (
                  <Tab key={category.id} label={category.name} />
                ))}
              </Tabs>
              <IconButton onClick={() => setIsGridView(!isGridView)}>
                {isGridView ? <DatabaseTwoTone /> : <AppstoreTwoTone />}
              </IconButton>
            </Box>
            {renderList()}
          </MainCard>
        </>
      )}

      <Dialog fullWidth open={todoDetailsDialogOpen} onClose={handleCloseTodoDetailsDialog}>
        <DialogTitle>{isEditMode ? 'Edit Todo' : selectedTodo?.title}</DialogTitle>
        <DialogContent>
          {isEditMode ? (
            <>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                sx={{ my: 2 }}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="todo-status-selection-label">Status</InputLabel>
                <Select
                  labelId="todo-status-selection-label"
                  id="todo-status-selection"
                  value={editedStatus}
                  label="Status"
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="todo-category-selection-label">Category</InputLabel>
                <Select
                  labelId="todo-category-selection-label"
                  id="todo-category-selection"
                  value={editedCategory}
                  label="Category"
                  onChange={(e) => setEditedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <Typography variant="body1">{selectedTodo?.description}</Typography>
              {selectedTab === 0 && (
                <Chip label={getCategoryName(selectedTodo?.category_id)} sx={{ mt: 1 }} />
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Status: {getStatusTitle(selectedTodo?.status_id)}
              </Typography>

              <Box width='100%' display='flex' justifyContent='center'>
                {statuses?.map((status) => (
                  <Button
                    disabled={status.id === selectedTodo?.status_id}
                    key={status.id}
                    sx={{ mr: 1, mt: 1 }}
                    variant="outlined"
                    color="primary"
                    onClick={() => handleStatusChange(selectedTodo.id, status.id)}
                  >
                    {status.title}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {isEditMode ? (
            <Button onClick={handleSaveButtonClick} color="primary">
              Save
            </Button>
          ) : (
            <Button onClick={handleEditButtonClick} color="primary">
              Edit
            </Button>
          )}
          <Button onClick={handleCloseTodoDetailsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListToDo;