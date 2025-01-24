import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, Button, Chip, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import MainCard from 'components/MainCard';
import Toast from 'components/Toast';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
import { getLanguages } from 'utils/crud/LanguageController';
import queryClient from 'utils/queryClient';

function AddWord() {
    const { user } = useAuth();

    const [translations, setTranslations] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [word, setWord] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        const fetchLanguages = async () => {
            const languageList = await getLanguages();
            setLanguages(languageList);
        };

        fetchLanguages();
    }, []);

    useEffect(() => {
        const fetchLanguages = async () => {
            const languageList = await getLanguages();
            setLanguages(languageList);

            // If we already know the user's target language
            if (user[0]?.target_language) {
                // Find the corresponding language object
                const matchedLang = languageList.find(
                    (lang) => lang.code === user[0].target_language
                );
                if (matchedLang) {
                    setSelectedLanguage(matchedLang);
                }
            }
        };

        fetchLanguages();
    }, [user]);


    // Add a new translation input with unique ID
    const addTranslation = () => {
        if (translations.length >= languages.length) return;

        const newTranslation = {
            id: Date.now(), // unique ID
            language_code: '',
            translation: ''
        };
        setTranslations([...translations, newTranslation]);
    };

    // Remove a translation by ID
    const removeTranslation = (translationId) => {
        setTranslations(prevTranslations =>
            prevTranslations.filter(t => t.id !== translationId)
        );
    };

    // Update translation
    const updateTranslation = (id, field, value) => {
        setTranslations(prevTranslations =>
            prevTranslations.map(t =>
                t.id === id ? { ...t, [field]: value } : t
            )
        );
    };

    const handleSubmit = async () => {
        // 1. Filter out translations that do not have a language_code or translation text
        const filteredTranslations = translations.filter(
            (t) => t.language_code.trim() !== '' && t.translation.trim() !== ''
        );

        // 2. Build the payload with only valid translations
        const payload = {
            language_code: selectedLanguage.code,
            word: word,
            translations: filteredTranslations
        }

        try {
            const response = await axios.post('/api/words', payload);

            if (response.status === 201) {
                setSnackbar({
                    open: true,
                    message: 'Word created successfully',
                    severity: 'success'
                });

                queryClient.invalidateQueries(['words']); // Refetch the words
                resetFormFields();
            }

        } catch (error) {
            console.error('Error creating word:', error);
        }
    }

    const resetFormFields = () => {
        setWord('');
        setTranslations([]);
    }

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false
        });
    };

    return (
        <MainCard>
            <Box display='flex' justifyContent='end' mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlusOutlined />}
                    onClick={addTranslation}
                    disabled={translations.length >= languages.length}
                >
                    Add Translation
                </Button>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="main-language-selection-label">Language</InputLabel>
                <Select
                    labelId="main-language-selection-label"
                    id="main-language-select"
                    // We'll store or use the code, but keep the entire object in state if needed
                    value={selectedLanguage?.code ?? ''}
                    onChange={(e) => {
                        // Look up the entire language object from the selected code
                        const newLangObj = languages.find(lang => lang.code === e.target.value);
                        setSelectedLanguage(newLangObj);
                    }}
                >
                    {languages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code} disabled={lang?.code === selectedLanguage?.code}>
                            {lang.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                id="word-input"
                label="Word"
                variant="outlined"
                value={word}
                sx={{ mb: 2 }}
                onChange={(e) => setWord(e.target.value)}
                fullWidth
            />

            {translations.length > 0 && (
                <>
                    <Divider sx={{ mb: 2 }}>
                        <Chip label="Translations" />
                    </Divider>
                    {translations.map((translation) => (
                        <Grid key={translation.id} container spacing={2} sx={{ mb: 2 }} alignItems="center">
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Language</InputLabel>
                                    <Select
                                        value={translation.language_code}
                                        onChange={(e) => updateTranslation(translation.id, 'language_code', e.target.value)}
                                    >
                                        {languages.map(lang => (
                                            <MenuItem
                                                key={lang.code}
                                                value={lang.code}
                                                disabled={
                                                    //lang?.code === selectedLanguage?.code ||
                                                    translations.some((t) => t?.language_code === lang?.code)
                                                }
                                            >
                                                {lang.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={10} sm={9}>
                                <TextField
                                    fullWidth
                                    label="Translation"
                                    value={translation.translation}
                                    onChange={(e) => updateTranslation(translation.id, 'translation', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={2} sm={1} display='flex' justifyContent='end' alignItems='center'>
                                <IconButton
                                    color="error"
                                    size='large'
                                    onClick={() => removeTranslation(translation.id)}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}
                </>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
                fullWidth
                disabled={word === ''}
            >
                Create Word
            </Button>

            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
        </MainCard>
    );
}

export default AddWord;