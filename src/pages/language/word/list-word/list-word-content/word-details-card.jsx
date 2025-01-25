import { CloseOutlined } from '@ant-design/icons';
import { Box, Chip, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import React from 'react'

function WordDetailsCard({
    selectedWord,
    showWord = false,
    showLanguage = false,
    showTranslations = false,
    showSentences = false,
    showCloseIcon = false,
    handleCloseDetailsDialog
}) {

    const CardBGColor = 'primary.lighter';
    const CardTextColor = 'primary';

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