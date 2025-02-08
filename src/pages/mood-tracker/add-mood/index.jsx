import { Grid, Box, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

import CryingFaceImage from 'assets/images/moods/crying.png';
import SadFaceImage from 'assets/images/moods/sad.png';
import NeutralFaceImage from 'assets/images/moods/confused.png';
import SmileFaceImage from 'assets/images/moods/smile.png';
import HappyFaceImage from 'assets/images/moods/happy-face.png';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';
import Toast from 'components/Toast';

function AddMood() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [feelingText, setFeelingText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Mood colors keyed by mood value
    const moodColors = {
        0: '#f3d9fa',
        1: '#c5dff8',
        2: '#fff3bf',
        3: '#ffec99',
        4: '#c3f1cb',
    };

    const moods = [
        { name: 'crying', image: CryingFaceImage, value: 0 },
        { name: 'sad', image: SadFaceImage, value: 1 },
        { name: 'neutral', image: NeutralFaceImage, value: 2 },
        { name: 'smile', image: SmileFaceImage, value: 3 },
        { name: 'happy', image: HappyFaceImage, value: 4 },
    ];

    // Save the mood's numeric value on selection
    const handleSelectMood = (moodValue) => {
        setSelectedMood(moodValue);
    };

    const handleFeelingTextChange = (e) => {
        if (e.target.value.length <= 255) {
            setFeelingText(e.target.value);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await axios.post('/api/moods', {
                mood_score: selectedMood,
                feelings: feelingText,
            });

            queryClient.invalidateQueries(['moods']);

            setSelectedMood(null);
            setFeelingText('');
            setIsSubmitting(false);
            setSnackbar({
                open: true,
                message: 'Mood added successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.log(error);
            setIsSubmitting(false);
            setSnackbar({
                open: true,
                message: 'Failed to add mood. Please try again.',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false
        });
    };

    return (
        <>
            <Grid container justifyContent="center" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        align="center"
                        sx={{
                            mb: 4,
                            fontWeight: 600,
                            color: 'text.secondary',
                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                        }}
                    >
                        How are you feeling today?
                    </Typography>

                    {/* Mood Cards */}
                    <Grid container spacing={2} justifyContent="center">
                        {moods.map((mood) => {
                            const isSelected = selectedMood === mood.value;
                            return (
                                <Grid item xs={4} sm={2} md={2} key={mood.value}>
                                    <Box
                                        onClick={() => handleSelectMood(mood.value)}
                                        sx={{
                                            userSelect: 'none',
                                            cursor: 'pointer',
                                            borderRadius: '16px',
                                            p: 2,
                                            backgroundColor: isSelected ? moodColors[mood.value] : '#fafafa',
                                            border: isSelected ? '3px solid #1976d2' : '2px solid #e0e0e0',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            textAlign: 'center',
                                            width: '100%',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 3,
                                                backgroundColor: !isSelected ? '#f5f5f5' : moodColors[mood.value],
                                            },
                                            boxShadow: isSelected ? 3 : 0,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={mood.image}
                                            alt={mood.name}
                                            sx={{
                                                userSelect: 'none',
                                                width: { xs: 40, sm: 60, md: 80 },
                                                height: { xs: 40, sm: 60, md: 80 },
                                                mx: 'auto',
                                                mb: 1,
                                                filter: isSelected ? 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))' : 'none',
                                            }}
                                        />
                                        {/* Display only mood name on the UI */}
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                userSelect: 'none',
                                                fontWeight: 700,
                                                color: isSelected ? '#1976d2' : 'text.secondary',
                                                mt: 1,
                                                fontSize: { xs: '0.8rem', sm: '1rem' },
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {mood.name}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Text Box for User Feelings */}
                    <Box sx={{ mt: 4 }}>
                        <TextField
                            label="Share your feelings"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={feelingText}
                            onChange={handleFeelingTextChange}
                            inputProps={{ maxLength: 255 }}
                            helperText={`${feelingText.length}/255`}
                        />
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" disabled={isSubmitting} color="primary" fullWidth onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
        </>
    );
}

export default AddMood;
