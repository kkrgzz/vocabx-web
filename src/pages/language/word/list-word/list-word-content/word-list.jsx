import {
  CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Dialog, DialogContent, DialogActions,
  Button,
  Tab,
  Box,
  DialogTitle,
  Pagination,
  Grid,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
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
import RectangularSkeletonStack from 'components/RectangularSkeletonStack';

function WordList({
  showLanguageFilter = true,
  showTopPagination = true,
  showBottomPagination = true,
  wordsPerPage = 10
}) {
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

  // Separate state for language filter and dialog tabs
  const [languageFilter, setLanguageFilter] = useState('ALL');
  const [dialogTabValue, setDialogTabValue] = useState('1');
  const [page, setPage] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const perPage = wordsPerPage;

  // Modified query to include language filter
  const { data: words, isLoading: isWordsLoading, error } = useQuery({
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


  const handleLanguageFilter = (new_value) => {

    setLanguageFilter(new_value);
    var language_code = new_value;
    if (new_value === 'ALL') {
      language_code = null;
    }

    setSelectedLanguage(language_code);

    setPage(1);
  }

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



  if (error) {
    return <Typography color="error">Error loading words: {error.message}</Typography>;
  }

  return (
    <>
      {/* Language Filter */}
      {
        showLanguageFilter && <Grid container>
          <Grid item xs={12} sm={6}>
            {
              !isLanguagesLoading &&
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Stack direction='row' alignItems='center' gap={1}>
                  <Typography>
                    Languages:
                  </Typography>
                  <FormControl sx={{ minWidth: '148px' }} variant="outlined">
                    <Select
                      value={languageFilter}
                      onChange={(event) => handleLanguageFilter(event.target.value)}
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      {
                        languages?.map((language, index) => (
                          <MenuItem key={language.code} value={language.code}>
                            {language.name}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            }
          </Grid>
          <Grid item xs={12} sm={6}>
            {
              showTopPagination &&
              <Box display='flex' alignItems='center' justifyContent='end' mb={2}>
                {
                  !isWordsLoading && <Pagination count={words?.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />
                }

              </Box>
            }
          </Grid>
        </Grid>
      }


      {
        isWordsLoading
          ? (<RectangularSkeletonStack count={3} height={40} />)
          : (
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
          )
      }
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

      {
        showBottomPagination &&
        <Box display='flex' alignItems='center' justifyContent='end' mt={2}>
          {!isWordsLoading && <Pagination count={words?.last_page} page={page} onChange={handlePageChange} showFirstButton showLastButton />}
        </Box>
      }

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