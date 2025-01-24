
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query';
import MainCard from 'components/MainCard'
import React from 'react'
import { getWords } from 'utils/crud/WordController';

function WordList() {

  const { data: words, isLoading: isWordsLoading } = useQuery({
    queryKey: ['words'],
    queryFn: async () => getWords({ page: 1, perPage: 30, sort: 'desc' })
  });

  const columns = [
    { field: 'word', headerName: 'Word', flex: 1 },
  ];

  console.log(words);

  return (
    <MainCard>

      {
        !isWordsLoading &&
        <DataGrid
          rows={words?.data}
          columns={columns}
        />
      }

    </MainCard>
  )
}

export default WordList