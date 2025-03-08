import { Skeleton, Stack } from '@mui/material'
import React from 'react'

function RectangularSkeletonStack({ count = 3, height = 40 }) {
    return (
        <Stack gap={1}>
            {[...Array(count)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={height} />
            ))}
        </Stack>
    )
}

export default RectangularSkeletonStack