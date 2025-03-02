import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import { AsteriskSimple } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import MainCard from 'components/MainCard';
import Toast from 'components/Toast';
import React, { useState } from 'react';
import axios from 'utils/axios';
import { getTodoCategories } from 'utils/crud/TodoCategoryController';
import queryClient from 'utils/queryClient';

function TodoListCategory() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // Track category to be deleted
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category for editing
  const [categoryTitle, setCategoryTitle] = useState(''); // Track category title for editing

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const { data: categories, isLoading: isCategoriesLoading, isError } = useQuery({
    queryKey: ['todoCategories'],
    queryFn: async () => getTodoCategories(),
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryTitle(category.title);
    handleDialogOpen();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false
    });
  };

  const handleUpdateCategory = async () => {

    try {
      await axios.put(`/api/todo-categories/${selectedCategory.id}`, {
        title: categoryTitle,
      });

      queryClient.invalidateQueries(['todoCategories']);

      setSnackbar({
        open: true,
        message: 'Todo Category updated successfully!',
        severity: 'success'
      });

      handleDialogClose();
    } catch (error) {
      console.log("An error occured while updating todo category:", error);
      setSnackbar({
        open: true,
        message: 'An error occured while updating todo category!',
        severity: 'error'
      });
    }
  };

  const handleDeleteCategory = async (category) => {

    try {
      await axios.delete(`/api/todo-categories/${category.id}`);
      queryClient.invalidateQueries(['todoCategories']);
      setSnackbar({
        open: true,
        message: 'Todo Category deleted successfully!',
        severity: 'success'
      });
      handleDialogClose();
    } catch (error) {
      console.log("An error occured while deleting todo category:", error);
      setSnackbar({
        open: true,
        message: 'An error occured while deleting todo category!',
        severity: 'error'
      });
    }

    setConfirmDelete(null);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>

      <MainCard>
        <List>
          {isError && <ListItem>Error fetching categories</ListItem>}
          {isCategoriesLoading && <ListItem>Loading...</ListItem>}
          {!isCategoriesLoading && categories?.map((category) => (
            <ListItem key={category.id} disablePadding>
              <ListItemButton onClick={() => handleCategoryClick(category)}>
                <ListItemIcon>
                  <AsteriskSimple />
                </ListItemIcon>
                <ListItemText primary={category.title} />
              </ListItemButton>
              {
                confirmDelete === category.id
                  ? (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteCategory(category)}
                      color="error"
                    >
                      <CheckCircleOutlined />
                    </IconButton>
                  )
                  : (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => setConfirmDelete(confirmDelete === category.id ? null : category.id)}
                      color="error"
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )
              }
            </ListItem>
          ))}
        </List>
      </MainCard>

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle my={1}>Category Details</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            id="category-title"
            name="category-title"
            label="Category Title"
            fullWidth
            variant="outlined"
            value={categoryTitle}
            onChange={(e) => setCategoryTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {confirmDelete === selectedCategory?.id ? (
            <Button onClick={() => handleDeleteCategory(selectedCategory)} startIcon={<DeleteOutlined />} color="warning" variant="outlined">
              Confirm Delete
            </Button>
          ) : (
            <Button onClick={() => setConfirmDelete(selectedCategory?.id)} startIcon={<DeleteOutlined />} color="error" variant="outlined">
              Delete
            </Button>
          )}
          <Stack direction="row" spacing={1}>
            <Button onClick={handleDialogClose} startIcon={<CloseCircleOutlined />} color="warning" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory} startIcon={<SaveOutlined />} color="success" variant="outlined">
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />

    </>
  );
}

export default TodoListCategory;