import { Grid, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';
import Toast from 'components/Toast';

import CryingFaceImage from 'assets/images/moods/crying.png';
import SadFaceImage from 'assets/images/moods/sad.png';
import NeutralFaceImage from 'assets/images/moods/confused.png';
import SmileFaceImage from 'assets/images/moods/smile.png';
import HappyFaceImage from 'assets/images/moods/happy-face.png';

// Static data outside the component
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

function AddMood() {
    const [selectedMood, setSelectedMood] = useState(null);
    const [feelingText, setFeelingText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSelectMood = (moodValue) => setSelectedMood(moodValue);

    const handleFeelingTextChange = (e) => {
        if (e.target.value.length <= 255) setFeelingText(e.target.value);
    };

    const handleSubmit = async () => {
        if (selectedMood === null) {
            setSnackbar({ open: true, message: 'Please select a mood.', severity: 'warning' });
            return;
        }
        setIsSubmitting(true);
        try {
            await axios.post('/api/moods', { mood_score: selectedMood, feelings: feelingText });
            queryClient.invalidateQueries(['moods']);
            setSelectedMood(null);
            setFeelingText('');
            setSnackbar({ open: true, message: 'Mood added successfully!', severity: 'success' });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to add mood.',
                severity: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <>
            <Grid container justifyContent="center" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                <Grid item xs={12} sm={10} md={8}>
                    <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4, fontWeight: 600, color: 'text.secondary' }}>
                        How are you feeling today?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {moods.map((mood) => (
                            <Grid item xs={4} sm={2} md={2} key={mood.value}>
                                <Box
                                    onClick={() => handleSelectMood(mood.value)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Select ${mood.name} mood`}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSelectMood(mood.value)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        p: 2,
                                        backgroundColor: selectedMood === mood.value ? moodColors[mood.value] : '#fafafa',
                                        border: selectedMood === mood.value ? '3px solid #1976d2' : '2px solid #e0e0e0',
                                        textAlign: 'center',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    <Box component="img" src={mood.image} alt={mood.name} sx={{ width: 60, height: 60, mb: 1 }} />
                                    <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                                        {mood.name}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
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
                            error={feelingText.length === 255}
                            FormHelperTextProps={{
                                sx: { color: feelingText.length === 255 ? 'error.main' : 'text.secondary' },
                            }}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            disabled={isSubmitting}
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
        </>
    );
}

export default AddMood;