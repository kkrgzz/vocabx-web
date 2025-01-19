import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, FormControl, MenuItem, Select, TextField, Typography, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'utils/axios';
import { getUserInformation } from 'utils/crud/UserController';

const getLanguages = async () => {
  try {
    const response = await axios.get('/api/languages');
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function QuickWord() {
  const [languages, setLanguages] = useState([]);
  const [mainLanguage, setMainLanguage] = useState('');
  const [mainWord, setMainWord] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [translationWord, setTranslationWord] = useState('');
  const [isWordSaving, setIsWordSaving] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const mainWordInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [languages, user] = await Promise.all([getLanguages(), getUserInformation()]);
        setLanguages(languages);
        console.log(user.user);
        setMainLanguage(user.user[0]?.target_language || languages[0]?.code || '');
        setTranslationLanguage(user.user[0]?.mother_language || languages[0]?.code || '');
        if (mainWordInputRef?.current) {
          mainWordInputRef.current.focus();
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const handleMainLanguageChange = (event) => {
    setMainLanguage(event.target.value);
  };

  const handleMainWordChange = (event) => {
    setMainWord(event.target.value);
  };

  const handleTranslationLanguageChange = (event) => {
    setTranslationLanguage(event.target.value);
  };

  const handleTranslationWordChange = (event) => {
    setTranslationWord(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mainWord || !translationWord) return;

    setIsWordSaving(true);
    try {
      await axios.post('/api/words', {
        language_code: mainLanguage,
        word: mainWord,
        translations: [
          {
            language_code: translationLanguage,
            translation: translationWord
          }
        ]
      });
      setSnackbarMessage('Word added successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setMainWord('');
      setTranslationWord('');
      mainWordInputRef.current?.focus();
    } catch (error) {
      setSnackbarMessage('Error adding word');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error(error);
    } finally {
      setIsWordSaving(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: { xs: 'auto', sm: '100%' },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 2
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          Quick Add Word
        </Typography>
        <FormControl fullWidth>
          <Select
            displayEmpty
            value={mainLanguage || ''}
            onChange={handleMainLanguageChange}
          >
            {languages.length > 0 && languages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="main-word-input"
          label="Main Word"
          variant="filled"
          value={mainWord}
          onChange={handleMainWordChange}
          fullWidth
          inputRef={mainWordInputRef}
        />

        <FormControl fullWidth>
          <Select
            displayEmpty
            value={translationLanguage || ''}
            onChange={handleTranslationLanguageChange}
          >
            {languages.length > 0 && languages.map((language) => (
              <MenuItem key={language.code} value={language.code}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="translation-word-input"
          label="Translation"
          variant="filled"
          value={translationWord}
          onChange={handleTranslationWordChange}
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" disabled={isWordSaving}>
          {isWordSaving ? <CircularProgress size="30px" /> : 'Save'}
        </Button>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default QuickWord;