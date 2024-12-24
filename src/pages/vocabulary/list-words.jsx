import { Grid } from '@mui/material'
import MainCard from 'components/MainCard'
import React, { useState } from 'react'
import WordTable from './WordTable'
import WordDetailsCard from './word-details-card';

function ListWords() {

  const [selectedWord, setSelectedWord] = useState(null);

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} sm={12} md={6}>
        <MainCard title="Word List">
          <WordTable
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            selectButton={true}
            showTranslationsColumn={true}
            showSentencesColumn={true}
          />
        </MainCard>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <MainCard title="Selected Word">
          <WordDetailsCard 
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
          />
        </MainCard>
      </Grid>

    </Grid>
  )
}

export default ListWords