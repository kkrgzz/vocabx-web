import { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react'
import WordTable from './WordTable'
import EditWord from './edit-word';

function ListWord() {

    const [selectedWord, setSelectedWord] = useState(null);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title="Word List">
                    <WordTable
                        selectedWord={selectedWord}
                        setSelectedWord={setSelectedWord}
                        editButton={true}
                        deleteButton={true}
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title="Selected Word">
                    <EditWord 
                        selectedWord={selectedWord}
                        setSelectedWord={setSelectedWord}
                    />
                </MainCard>
            </Grid>
        </Grid>
    )
}

export default ListWord