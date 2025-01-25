import { Box, Button, Grid, IconButton, TextField } from "@mui/material"
import WordDetailsCard from "./word-details-card"
import { CheckCircleOutlined, DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "utils/axios";
import queryClient from "utils/queryClient";

function WordSentencesCard({
    editedWord,
    setEditedWord,
    setSnackbar
}) {

    const [selectedSentence, setSelectedSentence] = useState(null);
    const [newSentences, setNewSentences] = useState([]);
    const [originalWord] = useState(JSON.parse(JSON.stringify(editedWord)));
    const [changes, setChanges] = useState({
        anyChanges: false,
        hasSentencesChanged: false,
        hasNewSentencesCreated: false
    });

    const deleteMutation = useMutation({
        mutationFn: async (sentenceID) => axios.delete(`api/sentences/${sentenceID}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['words']);

            setEditedWord(prev => ({
                ...prev,
                sentences: prev.sentences.filter(s => s.id !== selectedSentence)
            }));

            setSelectedSentence(null);

            setSnackbar({
                open: true,
                message: 'Sentence deleted successfully',
                severity: 'success'
            });

        }
    });

    const addSentenceMutation = useMutation({
        mutationFn: (sentences) => axios.post(`api/sentences`, {
            sentences: sentences
        }),
        onSuccess: (response) => {
            queryClient.invalidateQueries(['words']);

            setEditedWord(prev => ({
                ...prev,
                sentences: [...prev.sentences, ...response.data]
            }))

            setNewSentences([]);

            setSnackbar({
                open: true,
                message: 'Sentences added successfully',
                severity: 'success'
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: (sentences) => axios.put(`api/sentences/bulk`, { sentences }),
        onSuccess: () => {
            queryClient.invalidateQueries(['words']);

            setSnackbar({
                open: true,
                message: 'Sentences updated successfully',
                severity: 'success'
            });
        }
    });


    const validateNewSentences = () => {
        const emptySentences = newSentences.filter(s => !s.sentence.trim());
        if (emptySentences.length > 0) {
            console.log('Empty sentences found:', emptySentences);

            setSnackbar({
                open: true,
                message: 'Please fill all sentences',
                severity: 'warning'
            });

            return false;
        }
        return true;
    };

    const checkChanges = () => {

        const hasSentencesChanged = editedWord?.sentences?.some((sentence, index) => {
            const originalSentence = originalWord?.sentences?.[index];
            return !originalSentence || sentence.sentence !== originalSentence.sentence;
        }) || false;

        const hasNewSentencesCreated = newSentences.length > 0;

        const anyChanges = hasNewSentencesCreated || hasSentencesChanged;

        setChanges({
            anyChanges,
            hasSentencesChanged,
            hasNewSentencesCreated
        });
    };

    useEffect(() => {
        checkChanges();
    }, [editedWord, newSentences]);

    const handleAddSentenceButton = () => {
        const newSentence = {
            id: `temp-${Date.now()}`,
            word_id: editedWord.id,
            sentence: ''
        }

        setNewSentences([...newSentences, newSentence]);
    }

    const updateSentence = (id, field, value) => {
        setNewSentences(prevSentences =>
            prevSentences.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            )
        )
    }

    const removeSentence = (sentenceID) => {
        setNewSentences(prevSentences =>
            prevSentences.filter(s => s.id !== sentenceID)
        )
    }

    const handleSave = () => {
        const updatedSentences = editedWord?.sentences;

        if (!validateNewSentences()) return;

        try {
            if (changes.hasSentencesChanged) {
                updateMutation.mutate(updatedSentences);
            }
            if (changes.hasNewSentencesCreated) {
                addSentenceMutation.mutate(newSentences);
            }
        } catch (error) {
            console.error('Error updating sentences:', error);

            setSnackbar({
                open: true,
                message: 'Error updating sentences',
                severity: 'error'
            });
        }
    }

    const handleDelete = (sentenceID) => {
        try {
            deleteMutation.mutate(sentenceID);
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: 'Error deleting sentence',
                severity: 'error'
            });
        }
    }

    return (
        <div>

            <WordDetailsCard
                selectedWord={editedWord}
                showWord
                showLanguage
                showTranslations
            />

            {editedWord?.sentences?.map((sentence, index) => (
                <Grid container spacing={2} key={sentence.id}>
                    <Grid item xs={11}>
                        <TextField
                            fullWidth
                            value={sentence?.sentence}
                            onChange={(e) => {
                                const newSentences = [...editedWord.sentences];
                                newSentences[index].sentence = e.target.value;
                                setEditedWord({ ...editedWord, sentences: newSentences });
                            }}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={1} display='flex' alignItems='center' justifyContent='center'>
                        {
                            selectedSentence && selectedSentence === sentence.id
                                ? (
                                    <IconButton color="success" onClick={() => { handleDelete(sentence.id) }}>
                                        <CheckCircleOutlined />
                                    </IconButton>
                                )
                                : (
                                    <IconButton color="error" onClick={() => { setSelectedSentence(sentence.id) }}>
                                        <DeleteOutlined />
                                    </IconButton>
                                )
                        }
                    </Grid>
                </Grid>
            ))
            }

            <Box display='flex' justifyContent='end' sx={{ my: 1 }}>
                <Button
                    startIcon={<PlusOutlined />}
                    variant='contained'
                    color='primary'
                    onClick={handleAddSentenceButton}
                >
                    Add Sentence
                </Button>
            </Box>

            {
                newSentences.length > 0 && newSentences?.map((sentence) => (
                    <Grid container spacing={2} sx={{ mb: 2 }} key={sentence.id}>
                        <Grid item xs={11}>
                            <TextField
                                fullWidth
                                label="Sentence"
                                value={sentence.sentence}
                                onChange={(e) => updateSentence(sentence.id, 'sentence', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={1} display='flex' alignItems='center' justifyContent='center'>
                            <IconButton color="error" onClick={() => removeSentence(sentence.id)}>
                                <DeleteOutlined />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))
            }

            <Button
                onClick={handleSave}
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

export default WordSentencesCard