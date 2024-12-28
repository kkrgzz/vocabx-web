import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Stack, Typography, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';

const fetchWords = async ({ page = 1, perPage = 30 }) => {
  try {
    const response = await axios.get('/api/words', {
      params: {
        page,
        perPage
      }
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

function QuickWordList() {
  const [page, setPage] = useState(1);

  const { data: wordsData, isLoading, isError } = useQuery({
    queryKey: ['words', page],
    queryFn: () => fetchWords({ page, perPage: 30 })
  });

  const words = wordsData?.data || [];
  const totalWords = wordsData?.total || 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography variant="h6" color="error">Error loading words</Typography>;
  }

  return (
    <MainCard title="Word List">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Language</TableCell>
              <TableCell>Word</TableCell>
              <TableCell>Turkish Translation</TableCell>
              <TableCell>Creation Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.map((word) => {
              const turkishTranslation = word.translations.find(t => t.language_code === 'tr')?.translation || 'N/A';
              return (
                <TableRow key={word.id}>
                  <TableCell>{word.language.name}</TableCell>
                  <TableCell>{word.word}</TableCell>
                  <TableCell>{turkishTranslation}</TableCell>
                  <TableCell>{new Date(word.created_at).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(totalWords / 30)}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Stack>
    </MainCard>
  );
}

export default QuickWordList;