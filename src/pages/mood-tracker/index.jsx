import MainCard from 'components/MainCard'
import React from 'react'
import AddMood from './add-mood'
import MoodEntries from './list-mood'
import { Grid } from '@mui/material'

function MoodTracker() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <MainCard>
          <AddMood />
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <MoodEntries />
        </MainCard>
      </Grid>
    </Grid>
  )
}

export default MoodTracker