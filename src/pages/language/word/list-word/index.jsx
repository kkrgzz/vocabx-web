import { Grid } from '@mui/material'
import React from 'react'
import WordList from './list-word-content/word-list'

function Words() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <WordList />
                </Grid>
            </Grid>
        </>
    )
}

export default Words