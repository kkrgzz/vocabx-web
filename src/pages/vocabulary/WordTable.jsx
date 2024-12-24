import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, IconButton, Pagination, Stack, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { DeleteOutlined, EditOutlined, FullscreenOutlined } from '@ant-design/icons';
import Dot from 'components/@extended/Dot';
import { useQuery } from '@tanstack/react-query';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';

function WordTable({ selectedWord, setSelectedWord, selectButton = false, editButton = false, deleteButton = false, showTranslationsColumn = false, showSentencesColumn = false }) {
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [wordToDelete, setWordToDelete] = useState(null);

    const { data: words, isLoading: isWordsLoading, isError: isWordsError } = useQuery({
        queryKey: ['words'],
        queryFn: async () => getWords({ page: page, perPage: 5 })
    });

    useEffect(() => {
        queryClient.invalidateQueries('words');
    }, [page]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleOpenDialog = (wordId) => {
        setWordToDelete(wordId);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setWordToDelete(null);
    };

    const handleDeleteWord = async () => {
        try {
            await axios.delete(`/api/words/${wordToDelete}`);
            queryClient.invalidateQueries('words');
            console.log('Word deleted successfully');
        } catch (error) {
            console.error('Error deleting word:', error);
        } finally {
            handleCloseDialog();
        }
    };

    function WordStatus({ status }) {
        let color;
        let title;

        switch (status) {
            case 0:
                color = 'success';
                title = 'has translations';
                break;
            case 1:
                color = 'error';
                title = 'no translations';
                break;
            case 2:
                color = 'warning';
                title = 'Rejected';
                break;
            default:
                color = 'primary';
                title = 'None';
        }

        return (
            <Stack direction="row" spacing={1} alignItems="center">
                <Dot color={color} />
                <Typography>{title}</Typography>
            </Stack>
        );
    }

    return (
        <>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            <TableCell>Language</TableCell>
                            <TableCell>Word</TableCell>
                            {showTranslationsColumn && <TableCell>Translations</TableCell>}
                            {showSentencesColumn && <TableCell>Sentences</TableCell>}
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            !isWordsLoading && words?.data?.map((word, index) => (
                                <TableRow hover key={`${word.id}-${index}`} role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1}>
                                    <TableCell component="th" scope="row">
                                        <Link color="secondary">{word.language.name}</Link>
                                    </TableCell>
                                    <TableCell>{word.word}</TableCell>
                                    {
                                        showTranslationsColumn && <TableCell>
                                            {word?.translations?.length}
                                        </TableCell>
                                    }
                                    {
                                        showSentencesColumn && <TableCell>
                                            {word?.sentences?.length}
                                        </TableCell>
                                    }
                                    <TableCell align="center">
                                        {
                                            editButton &&
                                            <IconButton color="primary" aria-label="edit" onClick={() => setSelectedWord(word)}>
                                                <EditOutlined />
                                            </IconButton>
                                        }
                                        {
                                            deleteButton &&
                                            <IconButton color="error" aria-label="delete" onClick={() => handleOpenDialog(word.id)}>
                                                <DeleteOutlined />
                                            </IconButton>
                                        }
                                        {
                                            selectButton &&
                                            <IconButton color="primary" aria-label="select" onClick={() => setSelectedWord(word)}>
                                                <FullscreenOutlined />
                                            </IconButton>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                    {
                        isWordsLoading
                            ? (<CircularProgress />)
                            : (<Pagination count={words?.last_page} page={page} onChange={handleChangePage} showFirstButton showLastButton />)
                    }
                </Stack>
            </TableContainer>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this word?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteWord} color="secondary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default WordTable;