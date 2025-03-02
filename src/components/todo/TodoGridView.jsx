import React from 'react'
import { Card, CardActionArea, CardContent, Chip, Grid, Typography } from '@mui/material'
import { TODO_STATUSES } from 'utils/getStatus';

function TodoGridView({ todos, selectedTab, handleTodoClick, getCategoryName }) {

    // Get status config or return a default
    const getStatusConfig = (status) => {
        return TODO_STATUSES[status] || { label: "Unknown", icon: Question, color: "primary" };
    };

    return (
        <Grid container spacing={2}>
            {todos.map(todo => (
                <Grid item xs={12} sm={6} md={4} key={todo.id}>
                    <Card sx={{ '&:hover': { boxShadow: 6 } }}>
                        <CardActionArea onClick={() => handleTodoClick(todo)}>
                            <CardContent>
                                {(() => {
                                    const statusConfig = getStatusConfig(todo.status);
                                    const StatusIcon = statusConfig.icon;
                                    return <StatusIcon style={{ color: statusConfig.color }} size={24} />;
                                })()}
                                <Typography variant="h6">{todo.title}</Typography>
                                {selectedTab === 0 && (
                                    <Chip label={getCategoryName(todo.category_id)} sx={{ mt: 1 }} />
                                )}
                                {

                                }
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}

export default TodoGridView