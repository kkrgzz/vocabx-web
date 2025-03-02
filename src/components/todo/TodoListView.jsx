import React from 'react'
import { Box, Grid, List, ListItemButton, ListItemText, Chip } from '@mui/material'
import { TODO_STATUSES } from 'utils/getStatus';

function TodoListView({ todos, selectedTab, handleTodoClick, getCategoryName }) {

    // Get status config or return a default
    const getStatusConfig = (status) => {
        return TODO_STATUSES[status] || { label: "Unknown", icon: Question, color: "primary" };
    };

    return (
        <Box display="flex" justifyContent="center">
            <List sx={{ width: '100%'}}>
                {todos.map(todo => (
                    <ListItemButton
                        key={todo.id}
                        onClick={() => handleTodoClick(todo)}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                cursor: 'pointer',
                            },
                            backgroundColor: 'white',
                            borderRadius: 1,
                            mb: 1,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Add shadow for better distinction
                        }}
                    >
                        <Grid container>
                            <Grid item xs={1} display='flex' alignItems='center'>
                                {(() => {
                                    const statusConfig = getStatusConfig(todo.status);
                                    const StatusIcon = statusConfig.icon;
                                    return <StatusIcon style={{ color: statusConfig.color }} size={24} />;
                                })()}
                            </Grid>
                            <Grid item xs={9}>
                                <ListItemText
                                    primary={todo.title}
                                    secondary={todo.description}
                                />
                            </Grid>

                            {selectedTab === 0 && (
                                <Grid item xs={2} sx={{ display: 'flex', justifyContent: { sm: 'start', md: 'end' }, alignItems: 'center' }}>
                                    <Chip label={getCategoryName(todo.category_id)} />
                                </Grid>
                            )}

                        </Grid>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default TodoListView