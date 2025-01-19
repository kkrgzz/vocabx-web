import { CircularProgress, FormControl, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import Toast from 'components/Toast';
import useAuth from 'hooks/useAuth';
import React, { useEffect, useState } from 'react'
import axios from 'utils/axios';
import { getLanguages } from 'utils/crud/LanguageController';

function Profile() {

  const [user, setUser] = useState([]);
  const [motherLanguageInput, setMotherLanguageInput] = useState(null);
  const [targetLanguageInput, setTargetLanguageInput] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  async function fetchUserInformation() {
    try {
      const response = await axios.get('/api/account/me');
      return response?.data?.user || [];
    } catch (error) {
      console.error('Error fetching user data:', error);
      return [];
    }
  }

  async function fetchLanguages() {
    try {
      const languages = await getLanguages();
      setLanguages(languages);
    } catch (error) {
      setToast({
        open: true,
        message: 'Error fetching languages',
        severity: 'error'
      });
    }
  }

  async function updateUserLanguages() {
    if (!motherLanguageInput || !targetLanguageInput) {
      setToast({
        open: true,
        message: 'Please select both languages',
        severity: 'warning'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put('/api/user/edit', {
        mother_language: motherLanguageInput,
        target_language: targetLanguageInput
      });

      setToast({
        open: true,
        message: 'Languages updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setToast({
        open: true,
        message: 'Error updating languages',
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  }


  useEffect(() => {

    async function getUser() {
      setUser(await fetchUserInformation());
    }
    getUser();

    fetchLanguages();
    setMotherLanguageInput(user[0]?.mother_language);
    setTargetLanguageInput(user[0]?.target_language);
  }, [user]);

  useEffect(() => {
    async function getUser() {
      setUser(await fetchUserInformation());
    }
    getUser();

    if (user[0]?.mother_language !== motherLanguageInput ||
      user[0]?.target_language !== targetLanguageInput) {
      if (typeof motherLanguageInput === "string" &&
        typeof targetLanguageInput === "string") {
        updateUserLanguages();
      }
    }
  }, [motherLanguageInput, targetLanguageInput]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MainCard title="Profile">
            Profile Section
          </MainCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <MainCard title="Language Preferences">

            {
              !isUpdating && languages?.length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={2} display='flex' alignItems='center'>
                    <Typography variant="h6">Mother Lng</Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={10}>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        value={motherLanguageInput}
                        onChange={(event) => setMotherLanguageInput(event.target.value)}
                      >
                        {languages?.map((language) => (
                          language?.code !== targetLanguageInput &&
                          <MenuItem key={language?.code} value={language?.code}>
                            {language?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={2} display='flex' alignItems='center'>
                    <Typography variant="h6">Target Lng</Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={10}>
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
                        value={targetLanguageInput}
                        onChange={(event) => setTargetLanguageInput(event.target.value)}
                      >
                        {languages?.map((language) => (
                          language.code !== motherLanguageInput &&
                          <MenuItem key={language?.code} value={language?.code}>
                            {language?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <CircularProgress />
              )
            }


          </MainCard>
        </Grid>
      </Grid>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </>
  )
}

export default Profile