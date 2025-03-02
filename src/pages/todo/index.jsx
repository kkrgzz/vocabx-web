import { Grid } from '@mui/material'
import React from 'react'
import AddToDo from './add-todo'
import ListToDo from './list-todo'

function ToDo() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
                <AddToDo
                    canExpandable={true}
                    initialExpanded={true}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <ListToDo
                    canExpandable={true}
                    initialExpanded={true}
                    showPagination={true}
                    showFilter={true}
                    showToggleView={true}
                />
            </Grid>
        </Grid>
    )
}

export default ToDo