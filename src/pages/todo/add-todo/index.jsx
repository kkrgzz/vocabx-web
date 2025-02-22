import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import React, { useState } from 'react';

function AddToDo({ canExpandable = true, initiallExpanded = true }) {
  const [todoCategories, setTodoCategories] = useState([]);
  const [selectedTodoCategory, setSelectedTodoCategory] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(initiallExpanded); // State to control accordion expansion

  const handleTodoCategoryChange = (event) => {
    setSelectedTodoCategory(event.target.value);
  };

  const handleTodoTextChange = (event) => {
    if (event.target.value.length <= 255) {
      setTodoText(event.target.value);
    }
  };

  const handleSubmitButton = async () => {
    setIsSubmitting(true);
  };

  const handleAccordionChange = (isExpanded) => {
    setExpanded(isExpanded);
  };

  const renderForm = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <TextField
          label="Create a new todo ..."
          variant="outlined"
          fullWidth
          value={todoText}
          onChange={handleTodoTextChange}
          inputProps={{ maxLength: 255 }}
          helperText={`${todoText.length}/255`}
        />
      </Grid>
      <Grid item xs={12} md={3}>
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
      <Grid item xs={12} display="flex" justifyContent="center">
        <Button
          onClick={handleSubmitButton}
          variant="contained"
          color="primary"
          sx={{
            width: '45%',
            height: '48px',
          
          }}
          startIcon={!isSubmitting && <PlusCircleOutlined />}
          disabled={isSubmitting}
        >
          {
            isSubmitting
              ? (<CircularProgress />)
              : ("Add Task")
          }
        </Button>
      </Grid>
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