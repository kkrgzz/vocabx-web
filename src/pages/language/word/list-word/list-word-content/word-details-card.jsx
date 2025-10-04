import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Box, Button, Chip, CircularProgress, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react'
import queryClient from 'utils/queryClient';
import { mapLanguageCodeForTatoeba, useTatoebaSentenceSearch, useTatoebaSentenceImport } from 'utils/tatoeba-api/tatoeba-search-sentence';

function WordDetailsCard({
    selectedWord,
    showWord = false,
    showLanguage = false,
    showTranslations = false,
    showSentences = false,
    showTatoebaSentences = false,
    showCloseIcon = false,
    handleCloseDetailsDialog
}) {

    const CardBGColor = 'primary.lighter';
    const CardTextColor = 'primary';

    const { data: tatoebaResults, isLoading: tatoebaLoading, error: tatoebaError } = useTatoebaSentenceSearch(
        selectedWord?.word,
        {
            language: mapLanguageCodeForTatoeba(selectedWord?.language_code || selectedWord?.language?.code),
            enabled: !!selectedWord && showTatoebaSentences
        }
    );

    const importMutation = useTatoebaSentenceImport({
        onSuccess: () => {
            // You might want to refresh the word data here
            console.log('Sentence imported successfully');
        },
        onError: (error) => {
            console.error('Error importing sentence:', error);
        }
    });

    const handleImportSentence = (sentence) => {
        if (selectedWord?.id) {
            importMutation.mutate({
                word_id: selectedWord.id,
                sentence: sentence,
            });
        }
    };

    return (
        <Box sx={{ padding: 2 }} bgcolor={CardBGColor} color={CardTextColor} component={Paper}>
            <Grid container>
                {showLanguage && (
                    <Grid item xs={6} display='flex' alignItems='center'>
                        <Chip label={selectedWord?.language?.name} color='success' />
                    </Grid>
                )}
                {
                    showCloseIcon && (
                        <Grid item xs={6} display='flex' alignItems='center' justifyContent='end'>
                            <IconButton onClick={handleCloseDetailsDialog}>
                                <CloseOutlined />
                            </IconButton>
                        </Grid>
                    )
                }
                {showWord && (
                    <Grid item xs={12}>
                        <Typography variant="h3" textAlign='center'>
                            {selectedWord?.word}
                        </Typography>
                    </Grid>
                )}
                {
                    // TRANSLATIONS SECTION
                    showTranslations && selectedWord?.translations?.length > 0 && (
                        <>
                            <Grid item xs={12} sx={{ my: 1 }}>
                                <Divider>
                                    <Chip label="Translations" color='warning' />
                                </Divider>
                            </Grid>
                            <Grid item xs={12}>
                                {selectedWord?.translations?.map((translation) => (
                                    <Typography key={translation.id} variant='h6'>
                                        {translation.language.name}: {translation.translation}
                                    </Typography>
                                ))}
                            </Grid>
                        </>
                    )
                }

                {
                    showSentences && selectedWord?.sentences?.length > 0 && (
                        <>
                            <Grid item xs={12} sx={{ my: 1 }}>
                                <Divider>
                                    <Chip label="Sentences" color='error' />
                                </Divider>
                            </Grid>

                            <Grid item xs={12}>
                                {selectedWord?.sentences?.map((sentence) => (
                                    <Typography key={sentence.id}>
                                        • {sentence.sentence}
                                    </Typography>
                                ))}
                            </Grid>
                        </>
                    )
                }

                {
                    // TATOEBA SENTENCES SECTION
                    showTatoebaSentences && selectedWord?.word && (
                        <>
                            <Grid item xs={12} sx={{ my: 1 }}>
                                <Divider>
                                    <Chip label="Tatoeba Suggestions" color='info' />
                                </Divider>
                            </Grid>

                            <Grid item xs={12}>
                                {tatoebaLoading && (
                                    <Box display="flex" alignItems="center" gap={1} sx={{ my: 2 }}>
                                        <CircularProgress size={20} />
                                        <Typography variant="body2">Loading suggestions from Tatoeba...</Typography>
                                    </Box>
                                )}

                                {tatoebaError && (
                                    <Typography variant="body2" color="error" sx={{ my: 1 }}>
                                        Failed to load Tatoeba suggestions: {tatoebaError.message}
                                    </Typography>
                                )}

                                {tatoebaResults && tatoebaResults.data && tatoebaResults.data.length > 0 && (
                                    <Box sx={{ my: 1 }}>
                                        {tatoebaResults.data.map((sentence, index) => (
                                            <Box key={sentence.id} sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 1,
                                                mb: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: 'background.paper',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}>
                                                <Typography variant="body2" sx={{ flex: 1 }}>
                                                    {index + 1}. {sentence.text}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleImportSentence(sentence)}
                                                    disabled={importMutation.isLoading}
                                                    color="primary"
                                                    sx={{ minWidth: 'auto', p: 0.5 }}
                                                >
                                                    {importMutation.isLoading ? (
                                                        <CircularProgress size={16} />
                                                    ) : (
                                                        <PlusOutlined style={{ fontSize: '14px' }} />
                                                    )}
                                                </IconButton>
                                            </Box>
                                        ))}
                                        {tatoebaResults.data.length === 0 && (
                                            <Typography variant="body2" color="text.secondary">
                                                No suggestions found for "{selectedWord.word}"
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {tatoebaResults && (!tatoebaResults.data || tatoebaResults.data.length === 0) && !tatoebaLoading && !tatoebaError && (
                                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                                        No Tatoeba suggestions found for "{selectedWord.word}"
                                    </Typography>
                                )}
                            </Grid>
                        </>
                    )
                }
                {
                    // If no translations or sentences, add some space
                    ((selectedWord?.sentences.length === 0 && selectedWord?.translations.length === 0) || !(!showTranslations && !showSentences))
                    && (
                        <Box margin={1} />
                    )
                }


            </Grid>
        </Box>
    )
}

export default WordDetailsCard