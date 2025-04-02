import { CheckCircleOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import WordDetailsCard from './word-details-card';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';
import { useMutation } from '@tanstack/react-query';
import LanguageSelector from 'components/LanguageSelector';

function WordTranslationsCard({
    editedWord,
    setEditedWord,
    languages,
    setSnackbar
}) {

    const [newTranslations, setNewTranslations] = useState([]);
    const [selectedTranslation, setSelectedTranslation] = useState(null);
    const [originalWord] = useState(JSON.parse(JSON.stringify(editedWord)));
    const [changes, setChanges] = useState({
        anyChanges: false,
        hasWordChanged: false,
        hasLanguageChanged: false,
        hasTranslationsChanged: false,
        hasNewTranslationsCreated: false,
        hasSentencesChanged: false
    });

    const deleteMutation = useMutation({
        mutationFn: async (translationId) => axios.delete(`api/translations/${translationId}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['words']);

            setEditedWord(prev => ({
                ...prev,
                translations: prev.translations.filter(t => t.id !== selectedTranslation)
            }));

            setSnackbar({
                open: true,
                message: 'Translation deleted successfully',
                severity: 'success'
            });

            setSelectedTranslation(null);
        }
    });

    const addTranslationsMutation = useMutation({
        mutationFn: (translations) => axios.post(`api/translations/bulk`, { translations }),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['words']);
            // Update local state with new translations
            setEditedWord(prev => ({
                ...prev,
                translations: [...prev.translations, ...response.data]
            }));

            setSnackbar({
                open: true,
                message: 'Translations added successfully',
                severity: 'success'
            });

            setNewTranslations([]);
        }
    });

    const updateTranslationsMutation = useMutation({
        mutationFn: (translations) => axios.put(`api/translations/bulk`, { translations }),
        onSuccess: () => {
            queryClient.invalidateQueries(['words']);

            setSnackbar({
                open: true,
                message: 'Translations updated successfully',
                severity: 'success'
            });
        }
    });

    const validateNewTranslations = () => {
        const emptyTranslations = newTranslations.filter(t => !t.translation.trim());
        if (emptyTranslations.length > 0) {
            console.log('Empty translations found:', emptyTranslations);

            setSnackbar({
                open: true,
                message: 'Please fill all translations',
                severity: 'warning'
            });

            return false;
        }
        return true;
    }

    const checkChanges = () => {
        const hasWordChanged = editedWord?.word !== originalWord?.word;
        const hasLanguageChanged = editedWord?.language?.code !== originalWord?.language?.code;

        const hasTranslationsChanged = editedWord?.translations?.some((translation, index) => {
            const originalTranslation = originalWord?.translations?.[index];
            return !originalTranslation || translation.translation !== originalTranslation.translation;
        }) || false;

        const hasNewTranslationsCreated = newTranslations.length > 0;

        const hasSentencesChanged = editedWord?.sentences?.some((sentence, index) => {
            const originalSentence = originalWord?.sentences?.[index];
            return !originalSentence || sentence.sentence !== originalSentence.sentence;
        }) || false;

        const anyChanges = hasWordChanged || hasLanguageChanged ||
            hasTranslationsChanged || hasNewTranslationsCreated ||
            hasSentencesChanged;

        setChanges({
            anyChanges,
            hasWordChanged,
            hasLanguageChanged,
            hasTranslationsChanged,
            hasNewTranslationsCreated,
            hasSentencesChanged
        });
    };

    useEffect(() => {
        checkChanges();
    }, [editedWord, newTranslations]);

    const handleAddTranslationButton = () => {
        if (newTranslations.length >= languages.length) return;

        const newTranslation = {
            id: Date.now(), // unique ID
            word_id: editedWord.id,
            language_code: '',
            translation: ''
        };
        setNewTranslations([...newTranslations, newTranslation]);
    }

    // Remove a translation by ID
    const removeTranslation = (translationId) => {
        setNewTranslations(prevTranslations =>
            prevTranslations.filter(t => t.id !== translationId)
        );
    };

    // Update translation
    const updateTranslation = (id, field, value) => {
        setNewTranslations(prevTranslations =>
            prevTranslations.map(t =>
                t.id === id ? { ...t, [field]: value } : t
            )
        );
    };

    const handleSaveEdit = async () => {
        const updatedTranslationsArray = editedWord.translations;
        const newTranslationsArray = newTranslations;

        if (!validateNewTranslations()) return;

        try {
            if (changes.hasTranslationsChanged) {
                await updateTranslationsMutation.mutateAsync(updatedTranslationsArray);
            }

            if (changes.hasNewTranslationsCreated) {
                await addTranslationsMutation.mutateAsync(newTranslationsArray);
            }
        } catch (error) {
            console.error('Error updating translations:', error);

            setSnackbar({
                open: true,
                message: 'Error updating translations',
                severity: 'error'
            });
        }
    };

    const deleteTranslation = (translationId) => {
        try {
            deleteMutation.mutate(translationId);
        } catch (error) {
            console.error('Error deleting translation:', error);

            setSnackbar({
                open: true,
                message: 'Error deleting translation',
                severity: 'error'
            });
        }
    };

    return (
        <div>

            <WordDetailsCard
                selectedWord={editedWord}
                showWord={true}
                showLanguage={false}
                showTranslations={false}
                showSentences={false}
                showCloseIcon={false}
                handleCloseDetailsDialog={null}
            />

            {editedWord?.translations.map((translation, index) => (
                <Grid container mt={1} key={index}>
                    <Grid item xs={11}>
                        <TextField
                            fullWidth
                            label={`${translation.language.name}`}
                            value={translation.translation}
                            onChange={(e) => {
                                const newTranslations = [...editedWord.translations];
                                newTranslations[index].translation = e.target.value;
                                setEditedWord({ ...editedWord, translations: newTranslations });
                            }}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={1} display='flex' justifyContent='center' alignItems='center'>
                        {
                            selectedTranslation && selectedTranslation === translation.id
                                ? (
                                    <IconButton color='success' onClick={() => deleteTranslation(translation.id)}>
                                        <CheckCircleOutlined />
                                    </IconButton>
                                )
                                : (
                                    <IconButton color='error' onClick={() => { setSelectedTranslation(translation.id) }}>
                                        <DeleteOutlined />
                                    </IconButton>
                                )
                        }
                    </Grid>
                </Grid>
            ))}


            <Box display='flex' justifyContent='end' sx={{ my: 1 }}>
                <Button
                    startIcon={<PlusOutlined />}
                    variant='contained'
                    color='primary'
                    onClick={handleAddTranslationButton}
                    disabled={newTranslations?.length >= (languages?.length - editedWord?.translations.length)}
                >
                    Add Translation
                </Button>
            </Box>


            {
                changes.hasNewTranslationsCreated && newTranslations.map((translation) => (
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }} key={translation.id}>
                        <Grid item xs={12} sm={2}>
                            <LanguageSelector
                                languages={languages.filter(lang =>
                                    !editedWord?.translations.some(t => t?.language_code === lang.code) &&
                                    !newTranslations.some(t => t?.language_code === lang.code)
                                )}
                                value={languages.find(lang => lang.code === translation.language_code) || null}
                                onChange={(newLang) =>
                                    updateTranslation(translation.id, 'language_code', newLang ? newLang.code : '')
                                }
                                useMotherLang
                                variant="autocomplete"
                                label="Language"
                                sx={{ mb: 2 }}
                            />
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
                ))
            }

            <Button
                onClick={handleSaveEdit}
                startIcon={<SaveOutlined />}
                variant="contained"
                color="primary"
                fullWidth
                disabled={!changes.anyChanges}
                sx={{ mt: 1 }}
            >
                Save
            </Button>

        </div >
    )
}

export default WordTranslationsCard