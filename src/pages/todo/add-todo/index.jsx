import { AlignLeftOutlined, DownOutlined, InfoCircleOutlined, PlusCircleOutlined, TagOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function AddToDo({ canExpandable = true, initiallExpanded = true }) {
  const [todoCategories, setTodoCategories] = useState([]);
  const [selectedTodoCategory, setSelectedTodoCategory] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [dueDate, setDueDate] = useState(dayjs());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(initiallExpanded); // State to control accordion expansion

  const maxTodoTitleLength = 64;
  const maxTodoDescriptionLength = 1024;

  const handleTodoCategoryChange = (event) => {
    setSelectedTodoCategory(event.target.value);
  };

  const handleTodoTitleChange = (event) => {
    if (event.target.value.length <= 255) {
      setTodoTitle(event.target.value);
    }
  };

  const handleTodoDescriptionChange = (event) => {
    if (event.target.value.length <= 255) {
      setTodoDescription(event.target.value);
    }
  };

  const handleSubmitButton = async () => {
    setIsSubmitting(true);
    // Add your submit logic here
    setIsSubmitting(false);
  };

  const handleAccordionChange = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderForm = () => (
    <Grid container spacing={2} justifyContent='center'>
      <Stack width='100%' maxWidth='600px' spacing={2} direction='column'>

        <Grid item xs={12}>
          <TextField
            label="Title"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <InfoCircleOutlined />
                </InputAdornment>
              )
            }}
            fullWidth
            value={todoTitle}
            onChange={handleTodoTitleChange}
            inputProps={{ maxLength: maxTodoTitleLength }}
            helperText={`${todoTitle.length}/${maxTodoTitleLength.toString()}`}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AlignLeftOutlined />
                </InputAdornment>
              )
            }}
            fullWidth
            value={todoDescription}
            onChange={handleTodoDescriptionChange}
            inputProps={{ maxLength: maxTodoDescriptionLength }}
            helperText={`${todoDescription.length}/${maxTodoDescriptionLength.toString()}`}
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(newValue) => {
              setDueDate(newValue);
            }}
            slotProps={{ textField: { variant: 'outlined' } }}
          />
        </LocalizationProvider>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="todo-category-selection-label">Category</InputLabel>
            <Select
              labelId="todo-category-selection-label"
              id="todo-category-selection"
              startAdornment={<InputAdornment position='start'><TagOutlined /></InputAdornment>}
              value={selectedTodoCategory}
              label="Category"
              onChange={handleTodoCategoryChange}
            >
              <MenuItem value={1}>Work</MenuItem>
              <MenuItem value={2}>Personal</MenuItem>
              <MenuItem value={3}>Shopping</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="center">
          <Button
            onClick={handleSubmitButton}
            variant="contained"
            color="success"
            sx={{
              width: '100%',
              maxWidth: '300px',
              height: '48px',
            }}
            startIcon={!isSubmitting && <PlusCircleOutlined />}
            disabled={isSubmitting || !selectedTodoCategory || !todoTitle}
          >
            {isSubmitting ? <CircularProgress /> : 'Add Task'}
          </Button>
        </Grid>
      </Stack>
    </Grid>
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
              Add a Task
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderForm()}
          </AccordionDetails>
        </Accordion>
      ) : (
        <MainCard>
          {renderForm()}
        </MainCard>
      )}
    </>
  );
}

export default AddToDo;