import { Box, Button, Divider, Grid, Stack, TextField } from '@mui/material'
import MainCard from 'components/MainCard'
import React, { useState } from 'react'

function EncryptionPlayground() {
    const [content, setContent] = useState('');

    const handleEncrypt = () => {

    }

    const handleDecrypt = () => {

    }

    return (
        <MainCard>
            <TextField
                id="content-input"
                label="Content"
                variant="outlined"
                value={content}
                sx={{ mb: 2 }}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
            />
            <Stack direction='row' spacing={2}>
                <Button variant='contained' color='info' onClick={() => handleEncrypt()}>Encrypt</Button>
                <Button variant='contained' color='error' onClick={() => handleDecrypt()}>Decrypt</Button>
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <MainCard title="Encryption Content">
                        <Box>Salt: {content}</Box>
                        <Box>Content: </Box>
                        <Box>Encrypted Content: </Box>
                    </MainCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <MainCard title="Decryption Content">
                        <Box>Encrypted Content: {content}</Box>
                        <Box>Decrypted Content: {content}</Box>
                    </MainCard>
                </Grid>
            </Grid>
        </MainCard>
    )
}

export default EncryptionPlayground