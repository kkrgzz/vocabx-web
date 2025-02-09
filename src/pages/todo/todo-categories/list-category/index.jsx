import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, PlayCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';

function TodoListCategory() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // Track category to be deleted
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category for editing
  const [categoryName, setCategoryName] = useState(''); // Track category name for editing

  const categories = [
    { id: 1, name: 'Work', user_id: 1 },
    { id: 2, name: 'Personal', user_id: 1 },
    { id: 3, name: 'Shopping', user_id: 1 },
    { id: 4, name: 'Home', user_id: 1 },
    { id: 5, name: 'Others', user_id: 1 }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    handleDialogOpen();
  };

  const handleUpdateCategory = async () => {
    console.log('Update Category:', selectedCategory);
    console.log('New value: ', categoryName);

    // Add your update logic here
    handleDialogClose();
  };

  const handleDeleteCategory = async (category) => {
    console.log('Delete Category:', category);
    // Add your delete logic here
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
    <MainCard>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} disablePadding>
            <ListItemButton onClick={() => handleCategoryClick(category)}>
              <ListItemIcon>
                <PlayCircleOutlined />
              </ListItemIcon>
              <ListItemText primary={category.name} />
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

      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle my={1}>Category Details</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            id="category-name"
            name="category-name"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
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
    </MainCard>
  );
}

export default TodoListCategory;