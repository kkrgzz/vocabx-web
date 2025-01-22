import React from 'react'
import AddWord from './word-content/add-word'
import { Grid } from '@mui/material'
import LastWords from './word-content/last-words'

function Word() {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={10}>
          <AddWord />
        </Grid>
        <Grid item xs={12} md={2}>
          <LastWords />
        </Grid>
      </Grid>
    </>
  )
}

export default Word