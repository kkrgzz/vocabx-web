import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Stack,
  Typography,
  CircularProgress,
  IconButton,
  Collapse,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { DownOutlined, UpOutlined, PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Toast from 'components/Toast';
import { useQuery } from '@tanstack/react-query';
import { getWords } from '../../utils/crud/WordController';
import queryClient from '../../utils/queryClient';
import { createSentences, deleteSentence } from '../../utils/crud/SentenceController';

function QuickWordList() {
  const [page, setPage] = useState(1);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [openRows, setOpenRows] = useState({});

  const [open, setOpen] = useState(false);
  const [sentenceToDelete, setSentenceToDelete] = useState(null);

  const {
    data: words,
    isLoading: isWordsLoading
  } = useQuery({
    queryKey: ['words'],
    queryFn: async () => getWords({ page: page, perPage: 30, sort: 'desc' })
  });

  useEffect(() => {
    queryClient.invalidateQueries(['words']);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false
    });
  };

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      const result = await deleteSentence(sentenceToDelete);
      if (result) {
        setSnackbar({
          open: true,
          message: 'Sentence deleted successfully',
          severity: 'success'
        });
        handleCloseDialog();
        await queryClient.invalidateQueries(['words']);
      }
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Error while sentence delete',
        severity: 'error'
      });
    }
  };

  function Row(props) {
    const { row } = props;
    const [newSentence, setNewSentence] = useState('');

    const date_options = {
      year: '2-digit',
      month: '2-digit',
      day: 'numeric'
    };

    const hour_options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };

    const handleAddSentence = async () => {
      let sentences = [];
      sentences[0] = { word_id: row.id, sentence: newSentence };

      try {
        await createSentences(sentences);

        setSnackbar({
          open: true,
          message: 'Sentence added successfully',
          severity: 'success'
        });

        queryClient.invalidateQueries(['words']);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error adding sentence',
          severity: 'error'
        });
        console.error('Error adding sentence:', error);
      }
    };

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => toggleRow(row.id)}>
              {openRows[row.id] ? <UpOutlined /> : <DownOutlined />}
            </IconButton>
          </TableCell>
          <TableCell>{row.word}</TableCell>
          <TableCell>{row.translations.find((t) => t.language_code === 'tr')?.translation || 'N/A'}</TableCell>
          <TableCell>
            <Stack direction="column">
              <Typography variant="body2">{new Date(row.created_at).toLocaleString('tr', hour_options)}</Typography>
              <Typography variant="subtitle2">{new Date(row.created_at).toLocaleString('tr', date_options)}</Typography>
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openRows[row.id]} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="sentences">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell sx={{width: '100%'}}>Sentence</TableCell>
                      <TableCell sx={{display: 'flex', justifyContent: 'center'}}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.sentences?.map((sentence, index) => (
                      <TableRow key={sentence.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{sentence.sentence}</TableCell>
                        <TableCell  sx={{display: 'flex', justifyContent: 'center'}}>
                          <IconButton edge="end" color="error" aria-label="delete" onClick={() => handleOpenDialog(sentence.id)}>
                            <DeleteOutlined />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}></Box>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={10} display="flex" alignItems="center">
                    <TextField
                      label="New Sentence"
                      variant="outlined"
                      value={newSentence}
                      onChange={(e) => setNewSentence(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2} display="flex" alignItems="center">
                    <Button
                      onClick={handleAddSentence}
                      variant="contained"
                      color="error"
                      startIcon={<PlusCircleOutlined />}
                      sx={{ width: '100%' }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <MainCard>
      {!isWordsLoading ? (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Word</TableCell>
                  <TableCell>Trans.</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {words?.data?.map((word) => (
                  <Row key={word.id} row={word} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Pagination count={words?.last_page} page={page} onChange={handleChangePage} showFirstButton showLastButton />
          </Stack>
        </>
      ) : (
        <CircularProgress />
      )}

      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to delete this sentence?</DialogContentText>
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

      <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
    </MainCard>
  );
}

export default QuickWordList;
