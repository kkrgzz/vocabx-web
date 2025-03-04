import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
} from '@mui/material';

// Import mood images
import CryingFaceImage from 'assets/images/moods/crying.png';
import SadFaceImage from 'assets/images/moods/sad.png';
import NeutralFaceImage from 'assets/images/moods/confused.png';
import SmileFaceImage from 'assets/images/moods/smile.png';
import HappyFaceImage from 'assets/images/moods/happy-face.png';
import { getMoods } from 'utils/crud/MoodController';
import { useQuery } from '@tanstack/react-query';

// A mapping of mood values to mood details
const moodData = {
    0: { name: 'crying', image: CryingFaceImage, color: '#f3d9fa' },
    1: { name: 'sad', image: SadFaceImage, color: '#c5dff8' },
    2: { name: 'neutral', image: NeutralFaceImage, color: '#fff3bf' },
    3: { name: 'smile', image: SmileFaceImage, color: '#ffec99' },
    4: { name: 'happy', image: HappyFaceImage, color: '#c3f1cb' },
};

function RecentMoods({ moodCount = 6 }) {

    const { data: moods, isLoading: isMoodsLoading } = useQuery({
        queryKey: ['moods'],
        queryFn: async () => getMoods({ count: moodCount })
    });


    return (
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                Recent Moods
            </Typography>
            {
                !isMoodsLoading
                    ? (
                        <Grid container spacing={3}>
                            {!isMoodsLoading && moods.map((entry) => {
                                // Get mood details using the mood value
                                const moodInfo = moodData[entry.mood_score];
                                // Format the timestamp to a readable format
                                const formattedDate = new Date(entry.created_at).toLocaleString();
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={entry.id}>
                                        <Card
                                            sx={{
                                                borderRadius: 2,
                                                backgroundColor: moodInfo.color,
                                                height: '100%',
                                            }}
                                        >
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <CardMedia
                                                        component="img"
                                                        image={moodInfo.image}
                                                        alt={moodInfo.name}
                                                        sx={{ width: 50, height: 50, mr: 2 }}
                                                    />
                                                    <Typography
                                                        variant="h6"
                                                        sx={{ textTransform: 'capitalize' }}
                                                    >
                                                        {moodInfo.name}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {entry.feelings}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formattedDate}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )
                    : (
                        <Box width='100%' display='flex' alignItems='center' justifyContent='center'>
                            <CircularProgress />
                        </Box>
                    )
            }
        </Box>
    );
}

export default RecentMoods;
