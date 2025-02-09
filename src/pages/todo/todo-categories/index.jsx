import { Grid } from '@mui/material'
import React from 'react'
import TodoAddCategory from './add-category'
import TodoListCategory from './list-category'

function TodoCategories() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <TodoAddCategory />
      </Grid>
      <Grid item xs={12} md={4}>
        <TodoListCategory />
      </Grid>
    </Grid>
  )
}

export default TodoCategories