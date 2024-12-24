import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, FormControl, InputLabel, Select, Box, Button, Stack, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'utils/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getLanguages = async () => {
  try {
    const response = await axios.get('/api/languages');
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
};

function EditWord({ selectedWord, setSelectedWord }) {
  const queryClient = useQueryClient();
  const [language, setLanguage] = useState(selectedWord?.language_code || '');
  const [word, setWord] = useState(selectedWord?.word || '');
  const [translations, setTranslations] = useState(selectedWord?.translations || []);
  const [open, setOpen] = useState(false);
  const [translationToDelete, setTranslationToDelete] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (selectedWord) {
      setLanguage(selectedWord.language_code || '');
      setWord(selectedWord.word || '');
      setTranslations(selectedWord.translations || []);
      setIsChanged(false);
    }
  }, [selectedWord]);

  const { data: languages, isLoading: isLanguagesLoading, isError: isLanguagesError } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => getLanguages(),
  });

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    setIsChanged(true);
  };

  const handleWordChange = (event) => {
    setWord(event.target.value);
    setIsChanged(true);
  };

  const handleTranslationChange = (index, field, value) => {
    const newTranslations = [...translations];
    newTranslations[index][field] = value;
    setTranslations(newTranslations);
    setIsChanged(true);
  };

  const handleAddTranslation = () => {
    setTranslations([...translations, { word_id: '', language_code: '', translation: '' }]);
    setIsChanged(true);
  };

  const handleOpenDialog = (index, translation_id) => {
    setTranslationToDelete({ index, translation_id });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setTranslationToDelete(null);
  };

  const handleRemoveTranslation = async () => {
    const { index, translation_id } = translationToDelete;
    try {
      const response = await axios.delete(`/api/translations/${translation_id}`);
      queryClient.invalidateQueries('words');
      const newTranslations = translations.filter((_, i) => i !== index);
      setTranslations(newTranslations);
      setIsChanged(true);
      console.log('Translation removed successfully:', response);
    } catch (error) {
      console.error('Error removing translation:', error);
    } finally {
      handleCloseDialog();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/words/${selectedWord.id}`, {
        language_code: language,
        word,
        translations,
      });
      queryClient.invalidateQueries('words');
      //setSelectedWord(null);
      setIsChanged(false);
      console.log('Word updated successfully:', response.data);
      // Optionally reset form or handle success state
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  if (!selectedWord) {
    return null; // or return some placeholder UI
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="language-select-label">Language</InputLabel>
          <Select
            labelId="language-select-label"
            id="language-select"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
          >
            {languages?.map((language, index) => (
              <MenuItem key={`${language.code}-${index}`} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="word-input"
          label="Word"
          variant="outlined"
          value={word}
          onChange={handleWordChange}
          fullWidth
        />
        {translations.map((translation, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl fullWidth>
              <InputLabel id={`target-language-select-label-${index}`}>Language</InputLabel>
              <Select
                labelId={`target-language-select-label-${index}`}
                id={`target-language-select-${index}`}
                value={translation.language_code}
                label="Language"
                onChange={(e) => handleTranslationChange(index, 'language_code', e.target.value)}
              >
                {languages
                  ?.filter((lang) => lang.code !== language)
                  .map((lang, idx) => (
                    <MenuItem key={`${lang.code}-${idx}`} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              id={`translation-input-${index}`}
              label="Translation"
              variant="outlined"
              value={translation.translation}
              onChange={(e) => handleTranslationChange(index, 'translation', e.target.value)}
              fullWidth
            />
            <IconButton onClick={() => handleOpenDialog(index, translation.id)} color="secondary">
              <DeleteOutlined />
            </IconButton>
          </Box>
        ))}
        <Button onClick={handleAddTranslation} variant="outlined" startIcon={<PlusCircleOutlined />}>
          Add Translation
        </Button>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" color="primary" disabled={!isChanged}>
            Update Word
          </Button>
          <Button type="reset" variant="outlined" color="secondary" onClick={() => setSelectedWord(null)}>
            Cancel
          </Button>
        </Stack>
      </Box>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this translation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveTranslation} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditWord;