import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Grid, Card, CardContent, List, ListItemButton, ListItemText, IconButton, CardActionArea, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { DownOutlined, AppstoreTwoTone, DatabaseTwoTone } from '@ant-design/icons';
import MainCard from 'components/MainCard';

function ListToDo({ canExpandable = true, initialExpanded = true }) {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isGridView, setIsGridView] = useState(true); // State to toggle between grid and list view
  const [expanded, setExpanded] = useState(initialExpanded); // State to control accordion expansion

  useEffect(() => {
    const fetchTodos = async () => {
      // Example todos
      const exampleTodos = [
        { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Cheese', category_id: 1 },
        { id: 2, title: 'Workout', description: 'Gym at 6 PM', category_id: 2 },
        { id: 3, title: 'Read a book', description: 'Finish reading "The Alchemist"', category_id: 3 },
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const filteredTodos = selectedTab === 0
    ? todos
    : todos.filter(todo => todo.category_id === categories[selectedTab - 1]?.id);

  const renderList = () => (
    <Box sx={{ p: 3 }}>
      {isGridView ? (
        <Grid container spacing={2}>
          {filteredTodos.map(todo => (
            <Grid item xs={12} sm={6} md={4} key={todo.id}>
              <Card sx={{ '&:hover': { boxShadow: 6 } }}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6">{todo.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{todo.description}</Typography>
                    {selectedTab === 0 && (
                      <Chip label={getCategoryName(todo.category_id)} sx={{ mt: 1 }} />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center">
          <List sx={{ width: '100%', maxWidth: 600 }}>
            {filteredTodos.map(todo => (
              <ListItemButton
                key={todo.id}
                sx={{
                  backgroundColor: '#f9f9f9', // Add background color
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
                </Grid>
              </ListItemButton>
            ))}
          </List>
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
    </>
  );
}

export default ListToDo;