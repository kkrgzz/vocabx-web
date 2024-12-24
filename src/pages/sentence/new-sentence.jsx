import { Chip, Divider, Grid } from '@mui/material'
import MainCard from 'components/MainCard'
import WordTable from 'pages/vocabulary/WordTable'
import React, { useEffect, useState } from 'react'
import AddSentenceCard from './add-sentence-card';
import ListSentence from './list-sentence';
import queryClient from 'utils/queryClient';

function NewSentence() {

    const [selectedWord, setSelectedWord] = useState(null);

    useEffect(() => {
        queryClient.invalidateQueries('words');
    }, [selectedWord]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title="Word List">
                    <WordTable
                        selectedWord={selectedWord}
                        setSelectedWord={setSelectedWord}
                        selectButton={true}
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title={selectedWord ? `Sentences for ${selectedWord.word}` : 'Add Sentence'}>
                    <ListSentence
                        selectedWord={selectedWord}
                        setSelectedWord={setSelectedWord}
                    />

                    <Divider sx={{ mb: 2 }}>
                        <Chip label="Add a New Sentence" size="small" />
                    </Divider>

                    <AddSentenceCard
                        selectedWord={selectedWord}
                        setSelectedWord={setSelectedWord}
                    />
                </MainCard>
            </Grid>
        </Grid>
    )
}

export default NewSentence