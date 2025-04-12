// sentence-editor.jsx
import { CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Grid, IconButton, Pagination, Tab, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
// Import useQueryClient
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getLanguages } from 'utils/crud/LanguageController';
import Toast from 'components/Toast';
import useAuth from 'hooks/useAuth';
import AICompletionButton from 'components/ai-assistant/AICompletionButton';

function SentenceEditor() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isAIGenerating, setIsAIGenerating] = useState(false); // Renamed for clarity

    // Get QueryClient instance
    const queryClient = useQueryClient();

    // --- React Query Setup ---
    const { data: wordsData, isLoading, isError, error: wordsError } = useQuery({
        queryKey: ['words', page, selectedLanguage],
        queryFn: () => getWords({ page: page, perPage: 20, sort: 'desc', language_code: selectedLanguage }),
        keepPreviousData: true, // Keeps previous data visible while fetching next page
    });

    const { data: languages, isLoading: isLanguagesLoading } = useQuery({
        queryKey: ['languages'],
        queryFn: () => getLanguages()
    });

    // Function to invalidate and refetch words query
    const invalidateWordsQuery = () => {
        queryClient.invalidateQueries({ queryKey: ['words', page, selectedLanguage] });
    };

    // --- Mutations (Updated) ---
    const updateSentenceMutation = useMutation({
        mutationFn: async (sentenceData) => axios.put(`api/sentences/${sentenceData.sentenceId}`, {
            sentence: sentenceData.text // Only send the text for updates
        }),
        onSuccess: () => {
            setSnackbar({ open: true, message: 'Sentence updated successfully', severity: 'success' });
            invalidateWordsQuery(); // Refetch data on success
            cancelEditing(); // Close editing form
        },
        onError: (error) => {
            console.error("Error updating sentence:", error);
            setSnackbar({ open: true, message: `Error updating sentence: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        }
    });

    const createSentenceMutation = useMutation({
        // mutationFn receives the full sentence object including AI data
        mutationFn: async (newSentenceData) => {
            const payload = {
                word_id: newSentenceData.word_id,
                sentence: newSentenceData.text, // The actual sentence text
                // Include the AI metadata fields
                is_ai_generated: newSentenceData.is_ai_generated || 0, // Default to 0 if not set
                ai_elapsed_time: newSentenceData.ai_elapsed_time,
                ai_prompt_tokens: newSentenceData.ai_prompt_tokens,
                ai_completion_tokens: newSentenceData.ai_completion_tokens,
            };
            
            return axios.post(`api/sentences`, payload);
        },
        onSuccess: () => {
            setSnackbar({ open: true, message: 'Sentence created successfully', severity: 'success' });
            invalidateWordsQuery(); // Refetch data on success
            cancelNewSentence(); // Close the new sentence form
        },
        onError: (error) => {
            console.error("Error creating sentence:", error);
            setSnackbar({ open: true, message: `Error creating sentence: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        }
    });

    const deleteSentenceMutation = useMutation({
        mutationFn: async (sentenceId) => axios.delete(`api/sentences/${sentenceId}`),
        onSuccess: () => {
            setSnackbar({ open: true, message: 'Sentence deleted successfully', severity: 'success' });
            invalidateWordsQuery(); // Refetch data on success
        },
        onError: (error) => {
            console.error("Error deleting sentence:", error);
            setSnackbar({ open: true, message: `Error deleting sentence: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        }
    });

    const [expanded, setExpanded] = useState(null);
    const [editing, setEditing] = useState({ word_id: null, sentenceId: null, text: '' });
    // Updated newSentence state structure slightly for clarity
    const initialNewSentenceState = {
        word_id: null,
        text: '',
        is_ai_generated: 0,
        ai_elapsed_time: 0,
        ai_prompt_tokens: 0,
        ai_completion_tokens: 0
    };
    const [newSentence, setNewSentence] = useState(initialNewSentenceState);

    useEffect(() => {
        // Reset page to 1 when language changes
        if (!isLanguagesLoading && languages) {
            const index = parseInt(tabValue) - 2;
            const selectedLang = index >= 0 ? languages[index]?.code : null;
            if (selectedLanguage !== selectedLang) { // Only update if language actually changed
                 setSelectedLanguage(selectedLang);
                 setPage(1); // Reset page when language tab changes
                 setExpanded(null); // Collapse accordions on tab change
            }
        }
    }, [tabValue, isLanguagesLoading, languages, selectedLanguage]); // Add selectedLanguage dependency

    const handleAccordionChange = (word_id) => (_, isExpanded) => {
        setExpanded(isExpanded ? word_id : null);
        // Reset forms if collapsing or expanding a *different* item
        if (!isExpanded || (isExpanded && expanded !== word_id)) {
             cancelEditing();
             cancelNewSentence();
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue); // State update will trigger useEffect above
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false })); // Prevent unnecessary re-renders
    };

    const startEditing = (word_id, sentenceId, text) => {
        cancelNewSentence(); // Ensure new sentence form is closed
        setEditing({ word_id, sentenceId, text });
    };

    const cancelEditing = () => {
        setEditing({ word_id: null, sentenceId: null, text: '' });
    };

    const saveEditing = () => {
         if (!editing.text?.trim()) {
             setSnackbar({ open: true, message: 'Sentence cannot be empty', severity: 'warning' });
             return;
         }
        // Call mutation - onSuccess handles UI update via invalidation
        updateSentenceMutation.mutate({
             sentenceId: editing.sentenceId,
             text: editing.text.trim()
         });
    };

    const handleDeleteSentence = (sentenceId) => {
        // Call mutation - onSuccess handles UI update via invalidation
        deleteSentenceMutation.mutate(sentenceId);
    };

    const startNewSentence = (word_id) => {
        cancelEditing(); // Ensure edit form is closed
        setNewSentence({ ...initialNewSentenceState, word_id: word_id }); // Reset with word_id
    };

    const saveNewSentence = () => {
        if (!newSentence.text?.trim()) {
             setSnackbar({ open: true, message: 'Sentence cannot be empty', severity: 'warning' });
             return;
         }
        // Call mutation with the full newSentence object state
        // Ensure text is trimmed before sending
        createSentenceMutation.mutate({
            ...newSentence,
            text: newSentence.text.trim()
        });
    };

    const cancelNewSentence = () => {
        setNewSentence(initialNewSentenceState); // Reset to initial state
        setIsAIGenerating(false); // Ensure AI flag is reset
    };


    // This function updates the newSentence state when AI completes
    const handleAICompletion = (aiResponse) => {
        if (!aiResponse?.content) {
            console.warn("AI response missing content:", aiResponse);
             setSnackbar({ open: true, message: 'AI failed to generate content.', severity: 'warning' });
            return;
        }

        // Update state with AI data
        setNewSentence(prev => ({
            ...prev, // Keep existing word_id
            text: aiResponse.content,
            is_ai_generated: 1, // Mark as AI generated
            // Safely parse float, default to null or 0 if invalid/missing
            ai_elapsed_time: !isNaN(parseFloat(aiResponse.elapsed_time)) ? parseFloat(aiResponse.elapsed_time) : null,
            ai_prompt_tokens: aiResponse.usage?.prompt_tokens ?? null, // Use nullish coalescing
            ai_completion_tokens: aiResponse.usage?.completion_tokens ?? null,
        }));
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Get the words to render directly from the query data
    const wordsToRender = wordsData?.data || [];

    const renderWordsAccordions = () => (
        wordsToRender.map(word => (
            <Accordion
                key={word.id}
                expanded={expanded === word.id}
                onChange={handleAccordionChange(word.id)}
                // Optionally disable interaction while mutations affecting this word occur
                // disabled={createSentenceMutation.isLoading && createSentenceMutation.variables?.word_id === word.id || ...}
            >
                <AccordionSummary expandIcon={<DownOutlined />}>
                    <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>{word.word}</Typography>
                    {/* Optional: Loading indicator for mutations related to this word */}
                    {(createSentenceMutation.isLoading && createSentenceMutation.variables?.word_id === word.id) && <CircularProgress size={20} sx={{ml: 1}} color="success" />}
                    {(updateSentenceMutation.isLoading && editing.word_id === word.id) && <CircularProgress size={20} sx={{ml: 1}} color="primary" />}
                    {(deleteSentenceMutation.isLoading && word.sentences.some(s => s.id === deleteSentenceMutation.variables)) && <CircularProgress size={20} sx={{ml: 1}} color="error" />}
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ width: '100%' }}>
                        {/* Render existing sentences */}
                        {word.sentences?.map(sentence => (
                            <Grid
                                container
                                key={sentence.id}
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                {editing.word_id === word.id && editing.sentenceId === sentence.id ? (
                                    // --- Editing Sentence Row ---
                                    <>
                                        <Grid item xs={12} sm={9}>
                                            <TextField
                                                fullWidth
                                                value={editing.text}
                                                onChange={(e) => setEditing(prev => ({ ...prev, text: e.target.value }))}
                                                autoFocus
                                                disabled={updateSentenceMutation.isLoading}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <IconButton onClick={saveEditing} color="success" disabled={updateSentenceMutation.isLoading || !editing.text?.trim()}>
                                                {updateSentenceMutation.isLoading ? <CircularProgress size={20} /> : <CheckOutlined />}
                                            </IconButton>
                                            <IconButton onClick={cancelEditing} color="error" disabled={updateSentenceMutation.isLoading}>
                                                <CloseOutlined />
                                            </IconButton>
                                        </Grid>
                                    </>
                                ) : (
                                    // --- Display Sentence Row ---
                                    <>
                                        <Grid item xs={12} sm={9}>
                                            <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>{sentence.sentence}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                             {/* Prevent editing/deleting while another mutation is running */}
                                            <IconButton
                                                onClick={() => startEditing(word.id, sentence.id, sentence.sentence)}
                                                color="primary"
                                                disabled={deleteSentenceMutation.isLoading || updateSentenceMutation.isLoading || createSentenceMutation.isLoading}
                                            >
                                                <EditOutlined />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteSentence(sentence.id)} // Only need sentenceId
                                                color="error"
                                                disabled={deleteSentenceMutation.isLoading || updateSentenceMutation.isLoading || createSentenceMutation.isLoading}
                                            >
                                                {deleteSentenceMutation.isLoading && deleteSentenceMutation.variables === sentence.id ? <CircularProgress size={20} /> : <DeleteOutlined />}
                                            </IconButton>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        ))}

                        {/* --- New Sentence Input Area --- */}
                        {newSentence.word_id === word.id ? (
                            <Grid container alignItems="center" spacing={1} sx={{ mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                                <Grid item xs={12} sm={9}>
                                    <TextField
                                        fullWidth
                                        value={newSentence.text}
                                        // Reset AI fields if user manually types
                                        onChange={(e) => setNewSentence(prev => ({
                                            ...initialNewSentenceState,
                                            word_id: prev.word_id,
                                            text: e.target.value
                                        }))}
                                        placeholder="Enter new sentence or use AI"
                                        disabled={isAIGenerating || createSentenceMutation.isLoading}
                                        autoFocus
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>

                                    <AICompletionButton
                                        word={word}
                                        tooltipTitle="Generate sentence with AI"
                                        disabled={isAIGenerating || createSentenceMutation.isLoading}
                                        onCompletionStart={() => setIsAIGenerating(true)}
                                        onCompletionSuccess={handleAICompletion}
                                        onCompletionEnd={() => setIsAIGenerating(false)}
                                        color="warning" 
                                    />
                                    <Tooltip title="Save New Sentence">
                                        <span> {/* Span for disabled tooltip */}
                                            <IconButton
                                                onClick={saveNewSentence}
                                                color="success"
                                                // Disable save if AI running, saving, or text is empty
                                                disabled={isAIGenerating || createSentenceMutation.isLoading || !newSentence.text?.trim()}
                                            >
                                                {createSentenceMutation.isLoading ? <CircularProgress size={20} /> : <CheckOutlined />}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                        <span> {/* Span for disabled tooltip */}
                                            <IconButton
                                                onClick={cancelNewSentence}
                                                color="error"
                                                // Only disable cancel if actually saving
                                                disabled={createSentenceMutation.isLoading}
                                            >
                                                <CloseOutlined />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        ) : (
                            // --- Add Sentence Button ---
                            <Button
                                variant="outlined"
                                onClick={() => startNewSentence(word.id)}
                                sx={{ mt: 2 }}
                                // Disable adding if any mutation is in progress or AI is generating for this word
                                disabled={isAIGenerating || createSentenceMutation.isLoading || updateSentenceMutation.isLoading || deleteSentenceMutation.isLoading}
                            >
                                Add Sentence
                            </Button>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        ))
    );

    // --- Main Return ---
    // Handle loading, error, and empty states for the main query
    const renderContent = () => {
        if (isLoading && !wordsData) { // Show loader only on initial load
            return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
        }
        if (isError) {
            console.error("Error loading words query:", wordsError);
            return <Typography color="error" sx={{ p: 2 }}>Error loading words: {wordsError?.message || 'Unknown error'}</Typography>;
        }
        if (!wordsToRender || wordsToRender.length === 0) {
            // Show message if loading is finished but no words found
            if (!isLoading) {
                return <Typography sx={{ p: 2 }}>No words found for the selected language.</Typography>;
            }
            // Otherwise, might still be loading background/paginated data, show nothing or subtle indicator
            return null;
        }
        // Render the accordions if data is available
        return renderWordsAccordions();
    };


    return (
        <>
            <TabContext value={tabValue}>
                <Grid container alignItems="center" spacing={1} sx={{ mb: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Grid item xs={12} md={8}>
                        <TabList
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="Language Tabs"
                        >
                            <Tab label="All" value="1" />
                            {isLanguagesLoading ? (
                                <Tab label={<CircularProgress size={20}/>} disabled />
                             ) : (
                                languages?.map((language, index) => (
                                <Tab key={language.code} label={language.name} value={(index + 2).toString()} />
                            )))}
                        </TabList>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {/* Show pagination only if there's data and more than one page */}
                         {wordsData && wordsData.last_page > 1 && (
                            <Box display='flex' alignItems='center' justifyContent={{ xs: 'center', md: 'flex-end' }} py={1}>
                                <Pagination
                                    count={wordsData.last_page}
                                    page={page}
                                    onChange={handlePageChange}
                                    showFirstButton
                                    showLastButton
                                    color="primary" // Theme color
                                />
                            </Box>
                         )}
                    </Grid>
                </Grid>

                {/* Render TabPanel Content */}
                <TabPanel value={tabValue} sx={{ px: { xs: 0.5, sm: 1 }, py: 1 }}> {/* Responsive padding */}
                    {renderContent()}
                </TabPanel>
                {/* No need to loop TabPanels - content is dynamic based on tabValue/selectedLanguage */}

            </TabContext>

            {/* Removed redundant bottom pagination */}

            <Toast
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000} // Standard duration
            />
        </>
    );
}

export default SentenceEditor;