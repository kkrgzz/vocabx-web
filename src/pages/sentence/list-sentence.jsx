import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box, ListItemButton, ListItemIcon, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';

function ListSentence({ selectedWord }) {
    const [open, setOpen] = useState(false);
    const [sentenceToDelete, setSentenceToDelete] = useState(null);

    if (!selectedWord) {
        return <Typography variant="h6">No word selected</Typography>;
    }

    const handleOpenDialog = (sentence_id) => {
        setSentenceToDelete(sentence_id);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSentenceToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/sentences/${sentenceToDelete}`);
            console.log('Sentence deleted successfully');
        } catch (error) {
            console.error('Error deleting sentence:', error);
        } finally {
            queryClient.invalidateQueries('words');
            handleCloseDialog();
        }
    };

    return (
        <>
            {selectedWord.sentences.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {selectedWord.sentences.map((sentence, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    color="error"
                                    aria-label="delete"
                                    onClick={() => handleOpenDialog(sentence.id)}
                                >
                                    <DeleteOutlined />
                                </IconButton>
                            }
                        >
                            <ListItemButton>
                                <ListItemIcon><MinusOutlined /></ListItemIcon>
                                <ListItemText primary={sentence.sentence} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No sentences available
                </Typography>
            )}

            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this sentence?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ListSentence;