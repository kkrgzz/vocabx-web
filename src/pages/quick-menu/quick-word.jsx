import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'utils/axios';
import MuiAlert from '@mui/material/Alert';

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
  const [isWordSaving, setIsWordSaving] = useState(false);
  const [translationLanguage, setTranslationLanguage] = useState('');
  const [translationWord, setTranslationWord] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const mainWordInputRef = useRef(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      const languagesData = await getLanguages();
      setLanguages(languagesData);
      setMainLanguage('en'); // Set default value after languages are fetched
      setTranslationLanguage('tr'); // Set default value after languages are fetched
    };

    fetchLanguages();
    mainWordInputRef.current.focus();
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
    setIsWordSaving(true);

    if (mainWord && translationWord) {
      try {
        const response = await axios.post('/api/words', {
          language_code: mainLanguage,
          word: mainWord,
          translations: [
            {
              language_code: translationLanguage,
              translation: translationWord,
            },
          ],
        });
        setSnackbarMessage('Word added successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Reset form after successful submission
        setMainWord('');
        setTranslationWord('');
        setIsWordSaving(false);
        mainWordInputRef.current.focus();
      } catch (error) {
        setSnackbarMessage('Error adding word');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        setIsWordSaving(false);
        console.error('Error adding word:', error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && mainWord && translationWord) {
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
        backgroundImage: 'url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/70c3b9b4-0a31-4edc-bc93-71c40f60d22d/didsiyz-eea5c19f-b84f-433a-8128-136dee9c1778.jpg/v1/fill/w_1280,h_720,q_75,strp/japan_winter_wallpaper__4__by_belindabindi_didsiyz-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzcwYzNiOWI0LTBhMzEtNGVkYy1iYzkzLTcxYzQwZjYwZDIyZFwvZGlkc2l5ei1lZWE1YzE5Zi1iODRmLTQzM2EtODEyOC0xMzZkZWU5YzE3NzguanBnIiwiaGVpZ2h0IjoiPD03MjAiLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS53YXRlcm1hcmsiXSwid21rIjp7InBhdGgiOiJcL3dtXC83MGMzYjliNC0wYTMxLTRlZGMtYmM5My03MWM0MGY2MGQyMmRcL2JlbGluZGFiaW5kaS00LnBuZyIsIm9wYWNpdHkiOjk1LCJwcm9wb3J0aW9ucyI6MC40NSwiZ3Jhdml0eSI6ImNlbnRlciJ9fQ.ZkFsbe5PQ2sLsw3qj1dZYy5pXAhJTvCcE5oMTvXKPWo)',
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
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Quick Add Word
        </Typography>
        <FormControl fullWidth>
          <Select
            displayEmpty
            value={mainLanguage}
            onChange={handleMainLanguageChange}
          >
            {languages.map((language) => (
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
            value={translationLanguage}
            onChange={handleTranslationLanguageChange}
          >
            {languages.map((language) => (
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