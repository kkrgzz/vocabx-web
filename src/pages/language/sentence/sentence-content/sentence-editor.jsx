// sentence-editor.jsx
import { CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Pagination, Tab, TextField, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getLanguages } from 'utils/crud/LanguageController';
import Toast from 'components/Toast';
import useAuth from 'hooks/useAuth';
import AICompletionButton from 'components/ai-assistant/AICompletionButton';
import AISentenceReviewButton from 'components/ai-assistant/AISentenceReviewButton';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, MagicWand, XCircle } from '@phosphor-icons/react'; // MagicWand might not be needed now

function SentenceEditor() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const { user } = useAuth();
    const [page, setPage] = useState(1);
    const [tabValue, setTabValue] = useState('1');
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [isAIGenerating, setIsAIGenerating] = useState(false);

    // --- AI Review Dialog State ---
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [viewingReviewContent, setViewingReviewContent] = useState(''); // Content to display in dialog
    const [viewingSentenceId, setViewingSentenceId] = useState(null);   // Which sentence's review is shown
    const [isSavingReview, setIsSavingReview] = useState(false); // Track if review is being saved

    const queryClient = useQueryClient();

    // --- React Query Setup ---
    const { data: wordsData, isLoading, isError, error: wordsError, refetch: refetchWords } = useQuery({
        queryKey: ['words', page, selectedLanguage],
        // Ensure your backend returns sentences with ai_review field
        queryFn: () => getWords({ page: page, perPage: 20, sort: 'desc', language_code: selectedLanguage }),
        keepPreviousData: true,
    });

    const { data: languages, isLoading: isLanguagesLoading } = useQuery({
        queryKey: ['languages'],
        queryFn: () => getLanguages()
    });

    // Function to invalidate and refetch words query
    const invalidateWordsQuery = () => {
        // Invalidate the specific query based on current page and language
        queryClient.invalidateQueries({ queryKey: ['words', page, selectedLanguage] });
        // Optionally trigger an immediate refetch if needed, though invalidation often suffices
        // refetchWords();
    };

    // --- Mutations ---
    const updateSentenceMutation = useMutation({
        // Accepts partial data { sentenceId, text?, ai_review? }
        mutationFn: async (sentenceData) => {
            const { sentenceId, ...updatePayload } = sentenceData; // Separate ID from payload
            return axios.put(`api/sentences/${sentenceId}`, updatePayload);
        },
        onMutate: (variables) => {
            // If updating review, set saving state
            if ('ai_review' in variables) {
                setIsSavingReview(true);
            }
        },
        onSuccess: (data, variables) => {
            // Check what was updated
            if ('text' in variables) {
                setSnackbar({ open: true, message: 'Sentence updated successfully', severity: 'success' });
                cancelEditing(); // Close editing form if text was updated
            } else if ('ai_review' in variables) {
                setSnackbar({ open: true, message: 'AI review saved successfully', severity: 'success' });
                // Review saved, now show it in the dialog
                setViewingReviewContent(variables.ai_review); // Display the review content just saved
                setViewingSentenceId(variables.sentenceId);   // Set the ID for context
                setReviewDialogOpen(true);                   // Open the dialog
            }
            invalidateWordsQuery(); // Refetch data to show updated review state (e.g., view icon)
        },
        onError: (error, variables) => {
            console.error("Error updating sentence:", error);
            const action = 'text' in variables ? 'updating sentence' : 'saving AI review';
            setSnackbar({ open: true, message: `Error ${action}: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        },
        onSettled: (data, error, variables) => {
            // Always reset saving state when mutation finishes
            if ('ai_review' in variables) {
                setIsSavingReview(false);
            }
        }
    });

    // (createSentenceMutation and deleteSentenceMutation remain largely the same)
    const createSentenceMutation = useMutation({
        mutationFn: async (newSentenceData) => {
            const payload = {
                word_id: newSentenceData.word_id,
                sentence: newSentenceData.text,
                is_ai_generated: newSentenceData.is_ai_generated || 0,
                ai_elapsed_time: newSentenceData.ai_elapsed_time,
                ai_prompt_tokens: newSentenceData.ai_prompt_tokens,
                ai_completion_tokens: newSentenceData.ai_completion_tokens,
            };
            return axios.post(`api/sentences`, payload);
        },
        onSuccess: () => {
            setSnackbar({ open: true, message: 'Sentence created successfully', severity: 'success' });
            invalidateWordsQuery();
            cancelNewSentence();
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
            invalidateWordsQuery();
        },
        onError: (error) => {
            console.error("Error deleting sentence:", error);
            setSnackbar({ open: true, message: `Error deleting sentence: ${error?.response?.data?.message || error.message}`, severity: 'error' });
        }
    });

    // --- Local State ---
    const [expanded, setExpanded] = useState(null);
    const [editing, setEditing] = useState({ word_id: null, sentenceId: null, text: '' });
    const initialNewSentenceState = { word_id: null, text: '', is_ai_generated: 0, ai_elapsed_time: 0, ai_prompt_tokens: 0, ai_completion_tokens: 0 };
    const [newSentence, setNewSentence] = useState(initialNewSentenceState);

    // --- Effects ---
    useEffect(() => {
        if (!isLanguagesLoading && languages) {
            const index = parseInt(tabValue) - 2;
            const selectedLang = index >= 0 ? languages[index]?.code : null;
            if (selectedLanguage !== selectedLang) {
                setSelectedLanguage(selectedLang);
                setPage(1);
                setExpanded(null);
            }
        }
    }, [tabValue, isLanguagesLoading, languages, selectedLanguage]);

    // --- Handlers ---
    const handleAccordionChange = (word_id) => (_, isExpanded) => {
        setExpanded(isExpanded ? word_id : null);
        if (!isExpanded || (isExpanded && expanded !== word_id)) {
            cancelEditing();
            cancelNewSentence();
        }
    };

    const handleTabChange = (_, newValue) => setTabValue(newValue);
    const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
    const startEditing = (word_id, sentenceId, text) => { cancelNewSentence(); setEditing({ word_id, sentenceId, text }); };
    const cancelEditing = () => setEditing({ word_id: null, sentenceId: null, text: '' });
    const saveEditing = () => {
        if (!editing.text?.trim()) {
            setSnackbar({ open: true, message: 'Sentence cannot be empty', severity: 'warning' }); return;
        }
        updateSentenceMutation.mutate({ sentenceId: editing.sentenceId, text: editing.text.trim() });
    };
    const handleDeleteSentence = (sentenceId) => deleteSentenceMutation.mutate(sentenceId);
    const startNewSentence = (word_id) => { cancelEditing(); setNewSentence({ ...initialNewSentenceState, word_id: word_id }); };
    const cancelNewSentence = () => { setNewSentence(initialNewSentenceState); setIsAIGenerating(false); };
    const saveNewSentence = () => {
        if (!newSentence.text?.trim()) {
            setSnackbar({ open: true, message: 'Sentence cannot be empty', severity: 'warning' }); return;
        }
        createSentenceMutation.mutate({ ...newSentence, text: newSentence.text.trim() });
    };

    const handleAICompletion = (aiResponse) => {
        if (!aiResponse?.content) {
            setSnackbar({ open: true, message: 'AI failed to generate content.', severity: 'warning' }); return;
        }
        setNewSentence(prev => ({
            ...prev,
            text: aiResponse.content,
            is_ai_generated: 1,
            ai_elapsed_time: !isNaN(parseFloat(aiResponse.elapsed_time)) ? parseFloat(aiResponse.elapsed_time) : null,
            ai_prompt_tokens: aiResponse.usage?.prompt_tokens ?? null,
            ai_completion_tokens: aiResponse.usage?.completion_tokens ?? null,
        }));
    };

    // Renamed: Triggered AFTER AI generates a NEW review successfully
    const handleNewAIReviewGenerated = (aiResponse, sentenceId) => {
        // Now trigger the mutation to SAVE this review
        // The mutation's onSuccess will handle opening the dialog
        updateSentenceMutation.mutate({
            sentenceId: sentenceId,
            ai_review: aiResponse.content // Pass the new review content
        });
    };

    // NEW: Triggered when clicking the "View Review" icon for an EXISTING review
    const handleViewExistingReview = (sentence) => {
        if (sentence.ai_review) {
            setViewingReviewContent(sentence.ai_review);
            setViewingSentenceId(sentence.id);
            setReviewDialogOpen(true);
        } else {
            // Should not happen if icon is only shown when review exists, but good practice
            setSnackbar({ open: true, message: 'No review available for this sentence.', severity: 'info' });
        }
    };

    const handlePageChange = (_, value) => setPage(value);
    const handleCloseReviewDialog = () => {
        setReviewDialogOpen(false);
        // Optional: Reset viewing state after closing
        // setViewingReviewContent('');
        // setViewingSentenceId(null);
    }

    // --- Rendering ---
    const wordsToRender = wordsData?.data || [];

    const renderWordsAccordions = () => (
        wordsToRender.map(word => (
            <Accordion
                key={word.id}
                expanded={expanded === word.id}
                onChange={handleAccordionChange(word.id)}
                // More specific disabling based on mutation target
                disabled={
                    (createSentenceMutation.isLoading && createSentenceMutation.variables?.word_id === word.id) ||
                    (updateSentenceMutation.isLoading && editing.word_id === word.id) ||
                    (deleteSentenceMutation.isLoading && word.sentences.some(s => s.id === deleteSentenceMutation.variables)) ||
                    (isSavingReview && word.sentences.some(s => s.id === updateSentenceMutation.variables?.sentenceId)) // Disable accordion if saving review within it
                }
            >
                <AccordionSummary expandIcon={<DownOutlined />}>
                    <Typography sx={{ flexGrow: 1, fontWeight: 'bold' }}>{word.word} - ({word?.sentences?.length || 0})</Typography>
                    {/* Spinners for relevant mutations */}
                    {(createSentenceMutation.isLoading && createSentenceMutation.variables?.word_id === word.id) && <CircularProgress size={20} sx={{ ml: 1 }} color="success" />}
                    {(updateSentenceMutation.isLoading && editing.word_id === word.id && 'text' in updateSentenceMutation.variables) && <CircularProgress size={20} sx={{ ml: 1 }} color="primary" />}
                    {(deleteSentenceMutation.isLoading && word.sentences.some(s => s.id === deleteSentenceMutation.variables)) && <CircularProgress size={20} sx={{ ml: 1 }} color="error" />}
                    {(isSavingReview && word.sentences.some(s => s.id === updateSentenceMutation.variables?.sentenceId)) && <CircularProgress size={20} sx={{ ml: 1 }} color="info" />} {/* Spinner for saving review */}
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
                                            <TextField fullWidth value={editing.text} onChange={(e) => setEditing(prev => ({ ...prev, text: e.target.value }))} autoFocus disabled={updateSentenceMutation.isLoading} />
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <IconButton onClick={saveEditing} color="success" disabled={updateSentenceMutation.isLoading || !editing.text?.trim()}>
                                                {updateSentenceMutation.isLoading && 'text' in updateSentenceMutation.variables ? <CircularProgress size={20} /> : <CheckOutlined />}
                                            </IconButton>
                                            <IconButton onClick={cancelEditing} color="error" disabled={updateSentenceMutation.isLoading}> <CloseOutlined /> </IconButton>
                                        </Grid>
                                    </>
                                ) : (
                                    // --- Display Sentence Row ---
                                    <>
                                        <Grid item xs={12} sm={isMobile ? 12 : 8} md={9}> {/* Adjust grid sizing */}
                                            <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>{sentence.sentence}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={isMobile ? 12 : 4} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            {/* Global disable check */}

                                            {/* Edit Button */}
                                            <Tooltip title="Edit Sentence">
                                                <span>
                                                    <IconButton
                                                        onClick={() => startEditing(word.id, sentence.id, sentence.sentence)}
                                                        color="primary"
                                                        disabled={
                                                            isSavingReview ||
                                                            deleteSentenceMutation.isLoading ||
                                                            updateSentenceMutation.isLoading ||
                                                            createSentenceMutation.isLoading
                                                        }
                                                    >
                                                        <EditOutlined />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                            {/* Show View Review Icon if review exists */}
                                            {sentence.ai_review && (
                                                <Tooltip title="View Existing AI Review">
                                                    {/* Wrap in span if potentially disabled */}
                                                    <span>
                                                        <IconButton
                                                            onClick={() => handleViewExistingReview(sentence)}
                                                            color="secondary"
                                                            disabled={
                                                                isSavingReview ||
                                                                deleteSentenceMutation.isLoading ||
                                                                updateSentenceMutation.isLoading ||
                                                                createSentenceMutation.isLoading
                                                            }
                                                        >
                                                            <Eye />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            )}
                                            {/* AI Review Button (always generates NEW review) */}
                                            <AISentenceReviewButton
                                                word={word}
                                                sentence={sentence.sentence}
                                                sentenceId={sentence.id}
                                                // Disable if any conflicting mutation is running OR if saving review for THIS sentence
                                                disabled={isSavingReview || deleteSentenceMutation.isLoading || updateSentenceMutation.isLoading || createSentenceMutation.isLoading}
                                                onReviewSuccess={handleNewAIReviewGenerated} // Pass the correct handler
                                                tooltipTitle={sentence.ai_review ? "Generate New AI Review" : "Review with AI"} // Dynamic tooltip
                                                color="info"
                                                icon={MagicWand}
                                            />
                                            {/* Delete Button */}
                                            <Tooltip title="Delete Sentence">
                                                <span>
                                                    <IconButton
                                                        onClick={() => handleDeleteSentence(sentence.id)}
                                                        color="error"
                                                        disabled={
                                                            deleteSentenceMutation.isLoading ||
                                                            updateSentenceMutation.isLoading ||
                                                            createSentenceMutation.isLoading ||
                                                            (isSavingReview && updateSentenceMutation.variables?.sentenceId === sentence.id)
                                                        }
                                                    >
                                                        {deleteSentenceMutation.isLoading && deleteSentenceMutation.variables === sentence.id ? <CircularProgress size={20} /> : <DeleteOutlined fontSize="small" />}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        ))}

                        {/* --- New Sentence Input Area --- */}
                        {newSentence.word_id === word.id ? (
                            <Grid container alignItems="center" spacing={1} sx={{ mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
                                <Grid item xs={12} sm={9}>
                                    <TextField fullWidth value={newSentence.text} onChange={(e) => setNewSentence(prev => ({ ...initialNewSentenceState, word_id: prev.word_id, text: e.target.value }))} placeholder="Enter new sentence or use AI" disabled={isAIGenerating || createSentenceMutation.isLoading} autoFocus multiline rows={2} />
                                </Grid>
                                <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                                    <AICompletionButton word={word} tooltipTitle="Generate sentence with AI" disabled={isAIGenerating || createSentenceMutation.isLoading} onCompletionStart={() => setIsAIGenerating(true)} onCompletionSuccess={handleAICompletion} onCompletionEnd={() => setIsAIGenerating(false)} color="warning" />
                                    <Tooltip title="Save New Sentence"><span><IconButton onClick={saveNewSentence} color="success" disabled={isAIGenerating || createSentenceMutation.isLoading || !newSentence.text?.trim()}>{createSentenceMutation.isLoading ? <CircularProgress size={20} /> : <CheckOutlined />}</IconButton></span></Tooltip>
                                    <Tooltip title="Cancel"><span><IconButton onClick={cancelNewSentence} color="error" disabled={createSentenceMutation.isLoading}><CloseOutlined /></IconButton></span></Tooltip>
                                </Grid>
                            </Grid>
                        ) : (
                            // --- Add Sentence Button ---
                            <Button variant="outlined" onClick={() => startNewSentence(word.id)} sx={{ mt: 2 }} disabled={isAIGenerating || createSentenceMutation.isLoading || updateSentenceMutation.isLoading || deleteSentenceMutation.isLoading || isSavingReview}>
                                Add Sentence
                            </Button>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        ))
    );

    const renderContent = () => {
        if (isLoading && !wordsData) return <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>;
        if (isError) return <Typography color="error" sx={{ p: 2 }}>Error loading words: {wordsError?.message || 'Unknown error'}</Typography>;
        if (!isLoading && (!wordsToRender || wordsToRender.length === 0)) return <Typography sx={{ p: 2 }}>No words found for the selected language.</Typography>;
        return renderWordsAccordions();
    };


    // --- Main Return ---
    return (
        <>
            <TabContext value={tabValue}>
                <Grid container alignItems="center" spacing={1} sx={{ mb: 1, borderBottom: 1, borderColor: 'divider' }}>
                    <Grid item xs={12} md={8}>
                        <TabList onChange={handleTabChange} variant="scrollable" scrollButtons="auto" aria-label="Language Tabs">
                            <Tab label="All" value="1" />
                            {isLanguagesLoading ? <Tab label={<CircularProgress size={20} />} disabled /> : (languages?.map((language, index) => <Tab key={language.code} label={language.name} value={(index + 2).toString()} />))}
                        </TabList>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {wordsData && wordsData.last_page > 1 && (
                            <Box display='flex' alignItems='center' justifyContent={{ xs: 'center', md: 'flex-end' }} py={1}>
                                <Pagination count={wordsData.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton color="primary" />
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <TabPanel value={tabValue} sx={{ px: { xs: 0.5, sm: 1 }, py: 1 }}>
                    {renderContent()}
                </TabPanel>
            </TabContext>

            {/* --- AI Review Dialog --- */}
            <Dialog
                open={reviewDialogOpen}
                onClose={handleCloseReviewDialog} // Use specific close handler
                maxWidth="md" // Allow more width for review content
                fullWidth
            >
                {/* Optionally show which sentence is being reviewed */}
                <DialogTitle>🔍AI Review📬</DialogTitle>
                <DialogContent dividers> {/* Add dividers for better separation */}
                    {/* Check if content exists before rendering Markdown */}
                    {viewingReviewContent ? (
                        <Markdown remarkPlugins={[remarkGfm]}>{viewingReviewContent}</Markdown>
                    ) : (
                        <Typography>No review content available.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReviewDialog} startIcon={<XCircle />}>Close</Button>
                    {/* Removed Review Again Button - Trigger review from the accordion */}
                </DialogActions>
            </Dialog>

            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} autoHideDuration={4000} />
        </>
    );
}

export default SentenceEditor;