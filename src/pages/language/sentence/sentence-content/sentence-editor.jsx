import { CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Grid, IconButton, Pagination, Tab, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getLanguages } from 'utils/crud/LanguageController';
import Toast from 'components/Toast';
import { Brain } from '@phosphor-icons/react';
import { AIClientWrapper } from 'utils/ai';
import useAuth from 'hooks/useAuth';

function SentenceEditor() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const { user } = useAuth();
    const aiClient = new AIClientWrapper(user?.profile?.api_key, user?.profile?.preferred_model_id);

    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isSentenceInputDisabled, setIsSentenceInputDisabled] = useState(false);

    const { data: wordsData, isLoading, isError } = useQuery({
        queryKey: ['words', page, selectedLanguage], // Include page and selectedLanguage in queryKey
        queryFn: async () => getWords({ page: page, perPage: 20, sort: 'desc', language_code: selectedLanguage })
    });

    const { data: languages, isLoading: isLanguagesLoading } = useQuery({
        queryKey: ['languages'],
        queryFn: async () => getLanguages()
    });

    const updateSentenceMutation = useMutation({
        mutationFn: async (sentence) => axios.put(`api/sentences/${sentence.sentenceId}`, {
            sentence: sentence.text
        }),
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: 'Sentence updated successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: 'Error updating sentence',
                severity: 'error'
            });
        }
    });

    const createSentenceMutation = useMutation({
        mutationFn: async (sentence) => axios.post(`api/sentences`, {
            word_id: sentence.word_id,
            sentence: sentence.text
        }),
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: 'Sentence created successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: 'Error creating sentence',
                severity: 'error'
            });
        }
    });

    const deleteSentenceMutation = useMutation({
        mutationFn: async (sentenceId) => axios.delete(`api/sentences/${sentenceId}`),
        onSuccess: () => {
            setSnackbar({
                open: true,
                message: 'Sentence deleted successfully',
                severity: 'success'
            });
        },
        onError: () => {
            setSnackbar({
                open: true,
                message: 'Error deleting sentence',
                severity: 'error'
            });
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

    useEffect(() => {
        if (!isLanguagesLoading && languages) {
            const index = parseInt(tabValue) - 2;
            const selectedLang = index >= 0 ? languages[index]?.code : null;
            setSelectedLanguage(selectedLang);
        }
    }, [tabValue, isLanguagesLoading, languages]);

    const handleAccordionChange = (word_id) => (_, isExpanded) => {
        setExpanded(isExpanded ? word_id : null);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false
        });
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


    const generateNewSentenceWithAI = async (word) => {
        try {
            setIsSentenceInputDisabled(true);
            const prompt = `You shoud write a sentence with the word "${word.word}". This words is from "${word.language_code}" language. I am trying to learn this word. Please write your example sentence in "${word.language_code}" language. You should write just a single sentence. Do not write any instructions or explanations.`;
            const response = await aiClient.getCompletion(prompt);
            setNewSentence(prev => ({ ...prev, text: response.content }));
        } catch (error) {
            console.log(error);
        } finally {
            setIsSentenceInputDisabled(false);
        }
    }
    
    const handlePageChange = (event, value) => {
        setPage(value);
    }

    const renderWordsAccordions = () => (
        localWords.map(word => (
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
                                        disabled={isSentenceInputDisabled}
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title="Generate a sentence with AI">
                                        {
                                            isSentenceInputDisabled
                                                ? (<CircularProgress size={24} />)
                                                : (
                                                    <IconButton onClick={() => generateNewSentenceWithAI(word)} color='primary' disabled={isSentenceInputDisabled}>
                                                        <Brain />
                                                    </IconButton>
                                                )
                                        }
                                    </Tooltip>
                                    <Tooltip title="Save">
                                        <IconButton onClick={saveNewSentence} color="success">
                                            <CheckOutlined />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <IconButton onClick={cancelNewSentence} color="error">
                                            <CloseOutlined />
                                        </IconButton>
                                    </Tooltip>
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
        ))
    );

    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading words</div>;

    return (
        <>
            <TabContext value={tabValue}>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <TabList
                            onChange={handleTabChange}
                            variant="scrollable"
                            aria-label="Language Tabs"
                            allowScrollButtonsMobile={true}
                        >
                            <Tab label="All" value="1" />
                            {languages?.map((language, index) => (
                                <Tab key={language.code} label={language.name} value={(index + 2).toString()} />
                            ))}
                        </TabList>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display='flex' alignItems='center' justifyContent='end' mb={2}>
                            <Pagination count={wordsData.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />
                        </Box>
                    </Grid>
                </Grid>

                {/* 'All' TabPanel */}
                <TabPanel value="1" sx={{ px: 0, py: 1 }}>
                    {renderWordsAccordions()}
                </TabPanel>

                {/* Language TabPanels */}
                {languages?.map((language, index) => {
                    const tabValueForLanguage = (index + 2).toString();
                    return (
                        <TabPanel key={language.code} value={tabValueForLanguage} sx={{ px: 0, py: 1 }}>
                            {renderWordsAccordions()}
                        </TabPanel>
                    );
                })}
            </TabContext>
            <Box display='flex' alignItems='center' justifyContent='end' mt={2}>
                <Pagination count={wordsData.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />
            </Box>

            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
        </>
    );
}

export default SentenceEditor;