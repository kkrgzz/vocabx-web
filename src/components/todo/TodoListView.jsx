import React from 'react'
import { Box, Grid, List, ListItemButton, ListItemText, Chip } from '@mui/material'
import { TODO_STATUSES } from 'utils/getStatus';

function TodoListView({ todos, handleTodoClick }) {

    // Get status config or return a default
    const getStatusConfig = (status) => {
        return TODO_STATUSES[status] || { label: "Unknown", icon: Question, color: "primary" };
    };

    const truncateDescription = (description, wordLimit = 6) => {
        if (!description) return '';
        const words = description.split(' ');

        return words.length > wordLimit
            ? `${words.slice(0, wordLimit).join(' ')}...`
            : description;
    }

    return (
        <Box display="flex" justifyContent="center">
            <List sx={{ width: '100%' }}>
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
                                    secondary={truncateDescription(todo.description)}
                                />
                                {todo?.category?.title
                                    && <Chip variant='outlined' label={todo?.category?.title} />}

                            </Grid>

                        </Grid>
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

export default TodoListView