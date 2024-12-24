import React, { useState } from 'react';
import { Box, Button, TextField, IconButton, Stack, Typography } from '@mui/material';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'utils/axios';

function AddSentenceCard({ selectedWord }) {
  const [sentences, setSentences] = useState([]);

  const handleAddSentence = () => {
    setSentences([...sentences, { word_id: selectedWord.id, sentence: '' }]);
  };

  const handleSentenceChange = (index, value) => {
    const newSentences = [...sentences];
    newSentences[index].sentence = value;
    setSentences(newSentences);
  };

  const handleRemoveSentence = (index) => {
    const newSentences = sentences.filter((_, i) => i !== index);
    setSentences(newSentences);
  };

  const handleSubmit = async() => {

    try {
        const response = await axios.post('/api/sentences', {
            sentences: sentences,
        });

        console.log('Sentences added successfully:', response);
        setSentences([]);
    } catch (error) {
        console.error('Error adding sentences:', error);
    }

  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {selectedWord ? (
        <>
          {sentences.map((sentenceObj, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label={`Sentence ${index + 1}`}
                variant="outlined"
                value={sentenceObj.sentence}
                onChange={(e) => handleSentenceChange(index, e.target.value)}
                fullWidth
              />
              <IconButton onClick={() => handleRemoveSentence(index)} color="secondary">
                <DeleteOutlined />
              </IconButton>
            </Box>
          ))}
          <Button onClick={handleAddSentence} variant="outlined" startIcon={<PlusCircleOutlined />}>
            New Sentence
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Submit Sentences
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Please select a word to add sentences.
        </Typography>
      )}
    </Box>
  );
}

export default AddSentenceCard;