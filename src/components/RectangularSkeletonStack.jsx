import { Skeleton, Grid } from '@mui/material';
import React from 'react';

function RectangularSkeletonStack({ count = 3, height = 40, columns = 1 }) {
    return (
        <Grid container spacing={1}>
            {[...Array(count)].map((_, index) => (
                <Grid item xs={12 / columns} key={index}>
                    <Skeleton variant="rectangular" height={height} />
                </Grid>
            ))}
        </Grid>
    );
}

export default RectangularSkeletonStack;