import {
  CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Dialog, DialogContent, DialogActions,
  Button,
  Tab,
  Box,
  DialogTitle,
  Pagination,
  Grid,
} from '@mui/material';
import { EyeOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined, TranslationOutlined, DiffOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getWords } from 'utils/crud/WordController';
import axios from 'utils/axios';
import queryClient from 'utils/queryClient';
import WordDetailsCard from './word-details-card';
import WordEditCard from './word-edit-card';
import WordDeleteDialog from './word-delete-dialog';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import WordTranslationsCard from './word-translations-card';
import { getLanguages } from 'utils/crud/LanguageController';
import WordSentencesCard from './word-sentences-card';
import Toast from 'components/Toast';

function WordList() {
  const [selectedWord, setSelectedWord] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [editedWord, setEditedWord] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // Separate state for language tabs and dialog tabs
  const [languageTabValue, setLanguageTabValue] = useState('1');
  const [dialogTabValue, setDialogTabValue] = useState('1');
  const [page, setPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const perPage = 10;

  // Modified query to include language filter
  const { data: words, isLoading, error } = useQuery({
    queryKey: ['words', page, selectedLanguage],
    queryFn: async () => getWords({
      page: page,
      perPage: perPage,
      sort: 'desc',
      language_code: selectedLanguage
    })
  });

  const { data: languages, isLoading: isLanguagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => getLanguages()
  });

  useEffect(() => {
    if (!isLanguagesLoading && languages) {
      const index = parseInt(languageTabValue) - 2;
      const newLanguage = index >= 0 ? languages[index]?.code : null;
      setSelectedLanguage(newLanguage);
    }
  }, [languageTabValue, isLanguagesLoading, languages]);

  const handleLanguageTabChange = (event, newValue) => {
    setLanguageTabValue(newValue);
    setPage(1); // Reset to first page when changing languages
  };

  // Modified dialog tab handler
  const handleDialogTabChange = (event, newValue) => {
    setDialogTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  }

  const handleCloseDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedWord(null);
    setEditedWord(null);
  };

  const handleSaveEdit = async () => {
    try {

      const word = {
        id: editedWord.id,
        word: editedWord.word,
        language_code: editedWord.language.code,
      };

      const translations = editedWord.translations;
      const sentences = editedWord.sentences;

      // Update Word
      if (word.word != '' && word.language_code != '') {
        await axios.put(`api/words/${word.id}`, word);
      }

      // Update Translations
      if (translations.length > 0) {
        await axios.put(`api/translations/bulk`, {
          translations: translations
        });
      }

      // Update Sentences
      if (sentences.length > 0) {
        await axios.put(`api/sentences/bulk`, {
          sentences: sentences
        });
      }

      queryClient.invalidateQueries(['words']);

      setSnackbar({
        open: true,
        message: 'Word updated successfully',
        severity: 'success'
      });

      setSelectedWord(editedWord);
    } catch (error) {
      console.error('Error updating word:', error);

      setSnackbar({
        open: true,
        message: 'Error updating word',
        severity: 'error'
      });
    }
  };

  const handleRowClick = (word) => {
    handleOpenDetailsDialog(word);
  };

  const handleOpenDetailsDialog = (word) => {
    setSelectedWord(word);
    setEditedWord(word);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedWord(null);
    setEditedWord(null);
  };

  const handleDeleteClick = (event, word) => {
    event.stopPropagation(); // Prevent row click
    setWordToDelete(word);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setWordToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`api/words/${wordToDelete.id}`);
      queryClient.invalidateQueries(['words']);

      setSnackbar({
        open: true,
        message: 'Word deleted successfully',
        severity: 'success'
      });

      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting word:', error);

      setSnackbar({
        open: true,
        message: 'Error deleting word',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false
    });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading words: {error.message}</Typography>;
  }

  return (
    <>
      {/* Language Tabs */}
      <TabContext value={languageTabValue}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleLanguageTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Language tabs"
              >
                <Tab label="All Languages" value="1" />
                {languages?.map((language, index) => (
                  <Tab
                    key={language.code}
                    label={language.name}
                    value={(index + 2).toString()}
                  />
                ))}
              </TabList>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display='flex' alignItems='center' justifyContent='end' mb={2}>
              <Pagination count={words?.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />
            </Box>
          </Grid>
        </Grid>
      </TabContext>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Word</TableCell>
              <TableCell>Language</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words?.data?.map((word) => (
              <TableRow
                key={word.id}
                onClick={() => handleRowClick(word)}
                hover
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{word.word}</TableCell>
                <TableCell>{word.language?.name}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetailsDialog(word);
                  }}>
                    <EyeOutlined />
                  </IconButton>
                  <IconButton onClick={(e) => handleDeleteClick(e, word)}>
                    <DeleteOutlined />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <TabContext value={dialogTabValue}>
          <DialogTitle>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
              <TabList
                onChange={handleDialogTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Word Card Tabs"
              >
                <Tab icon={<UnorderedListOutlined />} label="Details" value="1" />
                <Tab icon={<EditOutlined />} label="Edit" value="2" />
                <Tab icon={<TranslationOutlined />} label="Translations" value="3" />
                <Tab icon={<DiffOutlined />} label="Sentences" value="4" />
              </TabList>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ padding: 0 }}>
            <TabPanel value="1">
              <WordDetailsCard
                selectedWord={selectedWord}
                showWord={true}
                showLanguage={true}
                showTranslations={true}
                showSentences={true}
                showCloseIcon={true}
                handleCloseDetailsDialog={handleCloseDetailsDialog}
              />
            </TabPanel>
            <TabPanel value="2">
              <WordEditCard
                editedWord={editedWord}
                setEditedWord={setEditedWord}
                handleSaveEdit={handleSaveEdit}
              />
            </TabPanel>
            <TabPanel value="3">
              <WordTranslationsCard
                editedWord={editedWord}
                setEditedWord={setEditedWord}
                languages={languages}
                setSnackbar={setSnackbar}
              />
            </TabPanel>

            <TabPanel value="4">
              <WordSentencesCard
                editedWord={editedWord}
                setEditedWord={setEditedWord}
                setSnackbar={setSnackbar}
              />
            </TabPanel>

          </DialogContent>

          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color='warning'
            >
              Close
            </Button>
          </DialogActions>
        </TabContext>
      </Dialog>

      <Box display='flex' alignItems='center' justifyContent='end' mt={2}>
        <Pagination count={words.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />
      </Box>

      {/* Delete Confirmation Dialog */}
      <WordDeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
        wordToDelete={wordToDelete}
      />

      <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
    </>
  );
}

export default WordList;