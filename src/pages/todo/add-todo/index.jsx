import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';

function AddToDo({ canExpandable = true, initiallExpanded = true }) {
  const [todoCategories, setTodoCategories] = useState([]);
  const [selectedTodoCategory, setSelectedTodoCategory] = useState(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
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
      <Stack width='100%' maxWidth='600px' spacing={1} direction='column'>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="todo-category-selection-label">Category</InputLabel>
            <Select
              labelId="todo-category-selection-label"
              id="todo-category-selection"
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
        <Grid item xs={12}>
          <TextField
            label="Title"
            variant="outlined"
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
            fullWidth
            multiline
            rows={4}
            value={todoDescription}
            onChange={handleTodoDescriptionChange}
            inputProps={{ maxLength: maxTodoDescriptionLength }}
            helperText={`${todoDescription.length}/${maxTodoDescriptionLength.toString()}`}
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Button
            onClick={handleSubmitButton}
            variant="contained"
            color="primary"
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