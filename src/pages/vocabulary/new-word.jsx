import React, { useEffect } from 'react';
import MainCard from 'components/MainCard';
import { TextField, MenuItem, FormControl, InputLabel, Select, Box, Button, Stack, IconButton, Grid } from '@mui/material';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'utils/axios';
import { useQuery } from '@tanstack/react-query';

const getLanguages = async () => {
    try {
        const response = await axios.get('/api/languages');
        return response?.data || [];
    } catch (error) {
        console.error('Error fetching languages:', error);
        return [];
    }
};

function NewWord() {
    const [language, setLanguage] = React.useState('');
    const [word, setWord] = React.useState('');
    const [translations, setTranslations] = React.useState([]);

    const { data: languages, isLoading: isLanguagesLoading, isError: isLanguagesError } = useQuery({
        queryKey: ['languages'],
        queryFn: async () => getLanguages(),
    });

    useEffect(() => {
        if (language === '' && !isLanguagesLoading) {
            setLanguage('en');
        }
    }, [languages]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleWordChange = (event) => {
        setWord(event.target.value);
    };

    const handleTranslationChange = (index, field, value) => {
        const newTranslations = [...translations];
        newTranslations[index][field] = value;
        setTranslations(newTranslations);
    };

    const handleAddTranslation = () => {
        setTranslations([...translations, { language_code: '', translation: '' }]);
    };

    const handleRemoveTranslation = (index) => {
        const newTranslations = translations.filter((_, i) => i !== index);
        setTranslations(newTranslations);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/words', {
                language_code: language,
                word,
                translations,
            });
            console.log('Word created successfully:', response.data);
            // Reset form after successful submission
            setLanguage('');
            setWord('');
            setTranslations([]);
        } catch (error) {
            console.error('Error creating word:', error);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title="Add Word">
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
                                {
                                    !isLanguagesLoading && languages?.map((language, index) => (
                                        <MenuItem key={`${language.code}-${index}`} value={language.code}>
                                            {language.name}
                                        </MenuItem>
                                    ))
                                }
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
                        <Button type="submit" variant="contained" color="primary">
                            Create Word
                        </Button>
                    </Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <MainCard title="Add Translations">
                    {word ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                                            {
                                                !isLanguagesLoading && languages
                                                    ?.filter((lang) => lang.code !== language)
                                                    .map((lang, idx) => (
                                                        <MenuItem key={`${lang.code}-${idx}`} value={lang.code}>
                                                            {lang.name}
                                                        </MenuItem>
                                                    ))
                                            }
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
                                    <IconButton onClick={() => handleRemoveTranslation(index)} color="secondary">
                                        <DeleteOutlined />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button onClick={handleAddTranslation} variant="outlined" startIcon={<PlusCircleOutlined />}>
                                Add Translation
                            </Button>
                        </Box>
                    )
                        : (<>Please enter a word first</>)}
                </MainCard>
            </Grid>
        </Grid>
    );
}

export default NewWord;