import { Grid } from '@mui/material'
import React from 'react'
import AddToDo from './add-todo'
import ListToDo from './list-todo'

function ToDo() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <AddToDo />
            </Grid>
            <Grid item xs={12} md={12}>
                <ListToDo />
            </Grid>
        </Grid>
    )
}

export default ToDo