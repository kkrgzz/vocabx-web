import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getMoods } from 'utils/crud/MoodController';

// Import mood images
import CryingFaceImage from 'assets/images/moods/crying.png';
import SadFaceImage from 'assets/images/moods/sad.png';
import NeutralFaceImage from 'assets/images/moods/confused.png';
import SmileFaceImage from 'assets/images/moods/smile.png';
import HappyFaceImage from 'assets/images/moods/happy-face.png';
import RectangularSkeletonStack from 'components/RectangularSkeletonStack';
import { getRandomVectorImage } from 'utils/getVectorImages';

// A mapping of mood values to mood details
const moodData = {
  0: { name: 'crying', image: CryingFaceImage, color: '#f3d9fa' },
  1: { name: 'sad', image: SadFaceImage, color: '#c5dff8' },
  2: { name: 'neutral', image: NeutralFaceImage, color: '#fff3bf' },
  3: { name: 'smile', image: SmileFaceImage, color: '#ffec99' },
  4: { name: 'happy', image: HappyFaceImage, color: '#c3f1cb' },
};

const randomPlaceholderImage = getRandomVectorImage();

function RecentMoods({ moodCount = 6 }) {
  const { data: moods, isLoading: isMoodsLoading } = useQuery({
    queryKey: ['moods'],
    queryFn: async () => getMoods({ count: moodCount }),
  });
  
  if (moods?.length === 0) {
    return (
      <Stack
        height={200}
        justifyContent="center"
        alignItems="center"
        spacing={2}
        >
          <img src={randomPlaceholderImage} alt="No moods recorded" width="200"/>
          <Typography variant="body2" color="textSecondary">
            No moods recorded yet
          </Typography>
      </Stack>
    );
  }

  return (
    <>
      {!isMoodsLoading ? (
        <Grid container spacing={1}>
          {moods.map((entry) => {
            // Get mood details using the mood value
            const moodInfo = moodData[entry.mood_score];
            // Format the timestamp to a readable format
            const formattedDate = new Date(entry.created_at).toLocaleString();
            return (
              <Grid item xs={12} sm={6} lg={4} sx={{
                display: 'flex',
                maxWidth: '100%',
                flexBasis: 'auto'
              }} key={entry.id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    backgroundColor: moodInfo.color,
                    width: '100%', // Add full width
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
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
      ) : (
        <RectangularSkeletonStack count={2} height={200} columns={2} />
      )}

    </>
  );
}

export default RecentMoods;