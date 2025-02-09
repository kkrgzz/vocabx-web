import { Box, Button, TextField } from '@mui/material'
import MainCard from 'components/MainCard'
import Toast from 'components/Toast';
import React, { useEffect, useState } from 'react'

function TodoAddCategory() {

  const [newCategoryText, setNewCategoryText] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (newCategoryText.trim().length === 0) {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  }, [newCategoryText]);

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false
    });
  };

  const handleNewCategoryTextChange = (e) => {
    setNewCategoryText(e.target.value);
  }

  const handleSubmit = async () => {
    setIsButtonActive(false);

    if (newCategoryText.trim().length === 0) {

      setSnackbar({
        open: true,
        message: 'Please enter a category name!',
        severity: 'error'
      });

      return;
    }

    try {

      setSnackbar({
        open: true,
        message: 'ToDo Category added successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Failed to create the category!',
        severity: 'error'
      });
    }
    setIsButtonActive(true);
  }

  return (
    <MainCard>
      <Box sx={{ mt: 4 }}>
        <TextField
          label="Category name"
          variant="outlined"
          fullWidth
          value={newCategoryText}
          onChange={handleNewCategoryTextChange}
          inputProps={{ maxLength: 64 }}
          helperText={`${newCategoryText.length}/64`}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" disabled={!isButtonActive} color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
      <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
    </MainCard>
  )
}

export default TodoAddCategory