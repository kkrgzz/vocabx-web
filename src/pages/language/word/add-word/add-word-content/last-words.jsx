import { RightCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query'
import MainCard from 'components/MainCard'
import React from 'react'
import { useNavigate } from 'react-router';
import { getWords } from 'utils/crud/WordController';

function LastWords() {

    const navigate = useNavigate();
    const colors = ['success', 'error', 'warning', 'default', 'info'];

    const { data: words, isLoading: isWordsLoading } = useQuery({
        queryKey: ['words'],
        queryFn: async () => getWords({ page: 1, perPage: colors.length, sort: 'desc' }),
    });

    const handleMoreWordsButton = () => navigate('/word/list');

    return (
        <MainCard>
            <Grid container spacing={1} justifyContent="center">
                {!isWordsLoading
                    ? (
                        words?.data?.map((word, index) => (
                            <Grid xs={6} sm={4} md={12} lg={12} key={word.id} item>
                                <Chip
                                    label={word?.word}
                                    color={colors[index % colors?.length]}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                        )
                        )
                    )
                    : (
                        <CircularProgress />
                    )}

                {!isWordsLoading && (words.length >= colors.length) && (
                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <Button onClick={() => handleMoreWordsButton()} endIcon={<RightCircleOutlined />}>More</Button>
                    </Grid>
                )}
            </Grid>
        </MainCard>
    )
}

export default LastWords