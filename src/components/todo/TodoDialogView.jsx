import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Calendar, Tag } from '@phosphor-icons/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TODO_STATUSES } from 'utils/getStatus';
import dayjs from 'dayjs';
import axios from 'utils/axios';

function TodoDialogView({ selectedTodo, todoDetailsDialogOpen, handleCloseTodoDetailsDialog, categories, setSnackbar }) {
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedStatus, setEditedStatus] = useState('');
    const [editedCategory, setEditedCategory] = useState('');
    const [editedDueDate, setEditedDueDate] = useState(dayjs());

    useEffect(() => {
        if (selectedTodo) {
            setEditedTitle(selectedTodo.title || '');
            setEditedDescription(selectedTodo.description || '');
            setEditedStatus(selectedTodo.status || 'TODO');
            setEditedCategory(selectedTodo.category_id || '');
            setEditedDueDate(dayjs(selectedTodo.due_date) || dayjs());
        }
    }, [selectedTodo]);

    const handleSaveButtonClick = async () => {
        const formattedDueDate = editedDueDate.isValid() ? editedDueDate.format('YYYY-MM-DD HH:mm:ss') : null;

        const updated_data = {
            title: editedTitle,
            description: editedDescription,
            status: editedStatus,
            category_id: editedCategory,
            due_date: formattedDueDate,
        };

        try {
            const response = await axios.put(`/api/todos/${selectedTodo.id}`, updated_data);

            setSnackbar({
                open: true,
                message: 'Todo saved successfully',
                severity: 'success',
            });
            console.log(response);
            //handleCloseTodoDetailsDialog();
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: 'An error occurred while saving the todo',
                severity: 'error',
            });
        }
    };

    return (
        <Dialog fullWidth open={todoDetailsDialogOpen} onClose={handleCloseTodoDetailsDialog}>
            <DialogTitle>
                <Typography sx={{ fontSize: '14pt' }}>Todo Details</Typography>
                <Typography>View and edit todo details</Typography>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1} sx={{ py: 1 }}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                    />

                    <Stack direction='row' alignItems='center'>
                        <Box padding={1} display='flex' alignItems='center'>
                            <Calendar size={24} />
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                sx={{ width: '100%' }}
                                label="Due Date"
                                value={editedDueDate}
                                onChange={(newValue) => setEditedDueDate(newValue)}
                                slotProps={{ textField: { variant: 'outlined' } }}
                            />
                        </LocalizationProvider>
                    </Stack>

                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="todo-status-selection-label">Status</InputLabel>
                        <Select
                            labelId="todo-status-selection-label"
                            id="todo-status-selection"
                            value={editedStatus}
                            label="Status"
                            onChange={(e) => setEditedStatus(e.target.value)}
                        >
                            {Object.entries(TODO_STATUSES).map(([key, { label }]) => (
                                <MenuItem key={key} value={key}>
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Stack direction='row'>
                        <Box padding={1} display='flex' alignItems='center'>
                            <Tag size={24} />
                        </Box>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="todo-category-selection-label">Category</InputLabel>
                            <Select
                                labelId="todo-category-selection-label"
                                id="todo-category-selection"
                                label="Category"
                                value={editedCategory}
                                onChange={(e) => setEditedCategory(e.target.value)}
                            >
                                <MenuItem value=''>None</MenuItem>
                                {categories?.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography variant='caption'>
                        Created: {selectedTodo?.created_at ? dayjs(selectedTodo.created_at).format('MMMM D, YYYY h:mm A') : 'N/A'}
                    </Typography>
                    <Typography variant='caption'>
                        Updated: {selectedTodo?.updated_at ? dayjs(selectedTodo.updated_at).format('MMMM D, YYYY h:mm A') : 'N/A'}
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveButtonClick} color="primary">
                    Save
                </Button>
                <Button onClick={handleCloseTodoDetailsDialog} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TodoDialogView;