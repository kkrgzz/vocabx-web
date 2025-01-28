import { CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Grid, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';

function SentenceEditor() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data: wordsData, isLoading, isError } = useQuery({
        queryKey: ['words'],
        queryFn: async () => getWords({ page: 1, perPage: 20, sort: 'desc' })
    });

    const updateSentenceMutation = useMutation({
        mutationFn: async (sentence) => axios.put(`api/sentences/${sentence.sentenceId}`, {
            sentence: sentence.text
        }),
        onSuccess: () => {
            console.log('Sentence updated successfully');
        }
    });

    const createSentenceMutation = useMutation({
        mutationFn: async (sentence) => axios.post(`api/sentences`, {
            word_id: sentence.word_id,
            sentence: sentence.text
        }),
        onSuccess: () => {
            console.log('Sentence created successfully');
        }
    });

    const deleteSentenceMutation = useMutation({
        mutationFn: async (sentenceId) => axios.delete(`api/sentences/${sentenceId}`),
        onSuccess: () => {
            console.log('Sentence deleted successfully');
        }
    });

    const [localWords, setLocalWords] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [editing, setEditing] = useState({ word_id: null, sentenceId: null, text: '' });
    const [newSentence, setNewSentence] = useState({ word_id: null, text: '' });

    useEffect(() => {
        if (wordsData?.data) {
            setLocalWords(wordsData.data);
        }
    }, [wordsData]);

    const handleAccordionChange = (word_id) => (_, isExpanded) => {
        setExpanded(isExpanded ? word_id : null);
    };

    const startEditing = (word_id, sentenceId, text) => {
        setEditing({ word_id, sentenceId, text });
    };

    const cancelEditing = () => {
        setEditing({ word_id: null, sentenceId: null, text: '' });
    };

    const saveEditing = () => {
        setLocalWords(words => words.map(word => {
            if (word.id === editing.word_id) {
                return {
                    ...word,
                    sentences: word.sentences.map(sentence =>
                        sentence.id === editing.sentenceId
                            ? { ...sentence, sentence: editing.text }
                            : sentence
                    )
                };
            }
            return word;
        }));

        updateSentenceMutation.mutate(editing);

        cancelEditing();
    };

    const handleDeleteSentence = (word_id, sentenceId) => {
        setLocalWords(words => words.map(word => {
            if (word.id === word_id) {
                return {
                    ...word,
                    sentences: word.sentences.filter(s => s.id !== sentenceId)
                };
            }
            return word;
        }));

        deleteSentenceMutation.mutate(sentenceId);
    };

    const startNewSentence = (word_id) => {
        setNewSentence({ word_id, text: '' });
    };

    const saveNewSentence = () => {
        if (!newSentence.text.trim()) return;

        setLocalWords(words => words.map(word => {
            if (word.id === newSentence.word_id) {
                const newSentenceObj = {
                    id: Date.now(),
                    sentence: newSentence.text.trim()
                };
                return {
                    ...word,
                    sentences: [...word.sentences, newSentenceObj]
                };
            }
            return word;
        }));

        createSentenceMutation.mutate(newSentence);

        setNewSentence({ word_id: null, text: '' });
    };

    const cancelNewSentence = () => {
        setNewSentence({ word_id: null, text: '' });
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading words</div>;

    return (
        <>
            {localWords.map(word => (
                <Accordion
                    key={word.id}
                    expanded={expanded === word.id}
                    onChange={handleAccordionChange(word.id)}
                >
                    <AccordionSummary expandIcon={<DownOutlined />}>
                        <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>{word.word}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <Box sx={{ p: word?.sentences?.length > 0 ? 2 : 0 }}>
                            {word.sentences?.map(sentence => (
                                <Grid
                                    container
                                    key={sentence.id}
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    {editing.word_id === word.id && editing.sentenceId === sentence.id ? (
                                        <>
                                            <Grid item xs={12} sm={9}>
                                                <TextField
                                                    fullWidth
                                                    value={editing.text}
                                                    onChange={(e) => setEditing(prev => ({ ...prev, text: e.target.value }))}
                                                    autoFocus
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton onClick={saveEditing} color="success">
                                                    <CheckOutlined />
                                                </IconButton>
                                                <IconButton onClick={cancelEditing} color="error">
                                                    <CloseOutlined />
                                                </IconButton>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item xs={12} sm={9}>
                                                <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>{sentence.sentence}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton
                                                    onClick={() => startEditing(word.id, sentence.id, sentence.sentence)}
                                                    color="primary"
                                                >
                                                    <EditOutlined />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => handleDeleteSentence(word.id, sentence.id)}
                                                    color="error"
                                                >
                                                    <DeleteOutlined />
                                                </IconButton>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            ))}

                            {newSentence.word_id === word.id ? (
                                <Grid container alignItems="center" sx={{ mt: 2 }}>
                                    <Grid item xs={12} sm={9}>
                                        <TextField
                                            fullWidth
                                            value={newSentence.text}
                                            onChange={(e) => setNewSentence(prev => ({ ...prev, text: e.target.value }))}
                                            placeholder="Enter new sentence"
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                                        <IconButton onClick={saveNewSentence} color="success">
                                            <CheckOutlined />
                                        </IconButton>
                                        <IconButton onClick={cancelNewSentence} color="error">
                                            <CloseOutlined />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => startNewSentence(word.id)}
                                    sx={{ mt: 2 }}
                                >
                                    Add Sentence
                                </Button>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
}

export default SentenceEditor;