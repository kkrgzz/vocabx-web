import { Grid, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import AddWord from 'pages/language/word/add-word/add-word-content/add-word'
import WordList from 'pages/language/word/list-word/list-word-content/word-list'
import RecentMoods from 'pages/mood-tracker/list-mood'
import AddToDo from 'pages/todo/add-todo'
import ListToDo from 'pages/todo/list-todo'
import React from 'react'

function Home() {
    return (
        <Grid container spacing={2}>


            <Grid item xs={12} md={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Add a new word</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <AddWord />
            </Grid>

            <Grid item xs={12} md={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Last words</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <WordList
                    wordsPerPage={5}
                    showLanguageFilter={false}
                    showExportButton={false}
                    showTopPagination={false}
                    showBottomPagination={false}
                />
            </Grid>


            <Grid item xs={12} md={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">New Task</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <AddToDo
                    canExpandable={false}
                />
            </Grid>


            <Grid item xs={12} md={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Recent Todos</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <ListToDo
                    todosPerPage={5}
                    canExpandable={false}
                    showPagination={false}
                    showFilter={false}
                    showToggleView={false}
                />
            </Grid>


            <Grid item xs={12} md={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Recent Moods</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <RecentMoods
                    moodCount={3}
                />
            </Grid>
        </Grid>
    )
}

export default Home