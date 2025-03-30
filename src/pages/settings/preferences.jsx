import MainCard from 'components/MainCard';
import React, { useState, useEffect } from 'react';
import { Box, Button, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getLanguages } from 'utils/crud/LanguageController';
import LanguageSelector from 'components/LanguageSelector';


function Preferences() {
  const [motherTongue, setMotherTongue] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const { data: languages, isLoading: isLanguagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => getLanguages()
  });


  const handleMotherTongueChange = (event) => {
    setMotherTongue(event.target.value);
  };

  const handleTargetLanguageChange = (event) => {
    setTargetLanguage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Mother Tongue:', motherTongue);
    console.log('Target Language:', targetLanguage);
  };

  return (
    <MainCard title="Preferences">
      <Divider sx={{ mb: 2 }} textAlign='center'>
        <Chip label="Language Preferences" size="small" color='error' variant='outlined' />
      </Divider>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LanguageSelector
          languages={languages}
          value={motherTongue}
          onChange={setMotherTongue}
          variant="autocomplete"
          label="Mother Tongue"
          sx={{ mb: 2 }}
        />
        <LanguageSelector
          languages={languages}
          value={targetLanguage}
          onChange={setTargetLanguage}
          variant="autocomplete"
          label="Main Target Language"
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Preferences
        </Button>
      </Box>
    </MainCard>
  );
}

export default Preferences;