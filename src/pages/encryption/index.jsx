import React, { useState, useMemo } from 'react'; // Import useMemo
import { Box, Button, Divider, Grid, Stack, TextField, Typography, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import EncryptionHelper from 'utils/encryption-helper';

function EncryptionPlayground() {
    // Input State
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');

    // Output/Crypto State - Store the bundle object from encryption
    const [encryptedData, setEncryptedData] = useState(null); // { salt, iv, ciphertext }
    const [decryptedContent, setDecryptedContent] = useState('');
    const [error, setError] = useState('');

    // Instantiate the helper. useMemo prevents recreating it on every render.
    const cryptoHelper = useMemo(() => new EncryptionHelper({ iterations: 10000 }), []);

    // --- Handlers ---
    const handleEncrypt = () => {
        setError('');
        setDecryptedContent('');
        setEncryptedData(null); // Clear previous encryption

        if (!content || !password) {
            setError('Please provide both content and a password.');
            return;
        }

        const result = cryptoHelper.encrypt(content, password);

        if (result) {
            setEncryptedData(result);
        } else {
            setError('Encryption failed. Check console for details.');
        }
    };

    const handleDecrypt = () => {
        setError('');
        setDecryptedContent('');

        if (!encryptedData || !password) {
            setError('Missing data for decryption (encrypted data or password). Encrypt something first.');
            return;
        }

        const result = cryptoHelper.decrypt(encryptedData, password);

        if (result !== null) {
            setDecryptedContent(result);
        } else {
            setError('Decryption failed. Check password or data integrity. Check console for details.');
        }
    };

    // --- Render ---
    return (
        <MainCard>
            {/* --- Inputs --- */}
            <TextField
                id="content-input"
                label="Content to Encrypt/Decrypt"
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
            />
            <TextField
                id="password-input"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                helperText={`Used for Key Derivation (PBKDF2 - ${cryptoHelper.iterations} iterations)`}
            />

            {/* --- Actions --- */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" color="info" onClick={handleEncrypt} disabled={!content || !password}>
                    Encrypt (AES-CBC + PBKDF2)
                </Button>
                <Button variant="contained" color="success" onClick={handleDecrypt} disabled={!encryptedData || !password}>
                    Decrypt
                </Button>
            </Stack>

             {/* --- Error Display --- */}
             {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
             )}

            <Divider sx={{ my: 2 }} />

            {/* --- Outputs --- */}
            <Grid container spacing={3}>
                {/* Encryption Results */}
                <Grid item xs={12} md={6}>
                    <MainCard title="Encryption Output">
                        <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">Salt (Hex):</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{encryptedData?.salt || 'N/A'}</Typography>
                        </Box>
                         <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">IV (Hex):</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{encryptedData?.iv || 'N/A'}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Encrypted Content (Base64):</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all', maxHeight: '200px', overflowY: 'auto' }}>
                                {encryptedData?.ciphertext || 'N/A'}
                            </Typography>
                        </Box>
                    </MainCard>
                </Grid>

                {/* Decryption Results */}
                <Grid item xs={12} md={6}>
                    <MainCard title="Decryption Output">
                         <Box sx={{ mb: 1 }}>
                            <Typography variant="subtitle2">Attempting to Decrypt (Base64):</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all', maxHeight: '100px', overflowY: 'auto' }}>
                                {encryptedData?.ciphertext || 'N/A'}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Decrypted Content (UTF-8):</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                {decryptedContent || 'N/A - Press Decrypt'}
                            </Typography>
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
        </MainCard>
    );
}

export default EncryptionPlayground;