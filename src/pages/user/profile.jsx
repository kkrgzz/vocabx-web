import { Avatar, Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import Toast from 'components/Toast';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';

function Profile() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [baseUserInfo, setBaseUserInfo] = useState([]);

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    profile_image: '',
    mother_language: '',
    target_language: '',
    api_key: '',
    preferred_model_id: ''
  });
  const [newProfileImage, setNewProfileImage] = useState(null); // File object for upload

  useEffect(() => {
    const getUserInformation = async () => {
      const response = await axios.get('api/auth/me');
      setBaseUserInfo(response?.data?.user);
    }
    getUserInformation();
  }, []);

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`api/user/profile/${baseUserInfo?.id}`);

        setProfile({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          profile_image: response.data.profile_image || '',
          mother_language: response.data.mother_language || '',
          target_language: response.data.target_language || '',
          api_key: response.data.api_key || '',
          preferred_model_id: response.data.preferred_model_id || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file); // Store the file for upload
      // Generate a preview URL for display
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profile_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // For Laravel to recognize PUT method

      // Append all profile fields except profile_image
      Object.keys(profile).forEach(key => {
        if (key !== 'profile_image') {
          formData.append(key, profile[key] || ''); // Ensure empty string if value is null/undefined
        }
      });

      // Append the new image file if it exists
      if (newProfileImage) {
        formData.append('profile_image', newProfileImage);
      }

      // Debug: Log FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      const response = await axios.post(`api/user/profile/${baseUserInfo?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setToast({
        open: true,
        message: 'Profile saved successfully',
        severity: 'success'
      });

      setNewProfileImage(null);
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error.response?.data?.message || 'Error saving profile';
      setToast({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MainCard title="Profile">
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  src={profile.profile_image}
                  sx={{ width: 80, height: 80 }}
                />
                <Button variant="contained" component="label">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </Button>
              </Stack>

              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={profile.first_name}
                onChange={handleInputChange}
              />

              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={profile.last_name}
                onChange={handleInputChange}
              />
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard title="Language Preferences">
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Mother Language</InputLabel>
                <Select
                  name="mother_language"
                  value={profile.mother_language}
                  label="Mother Language"
                  onChange={handleInputChange}
                >
                  <MenuItem value="tr">Turkish</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Target Language</InputLabel>
                <Select
                  name="target_language"
                  value={profile.target_language}
                  label="Target Language"
                  onChange={handleInputChange}
                >
                  <MenuItem value="tr">Turkish</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Preferred Model</InputLabel>
                <Select
                  name="preferred_model_id"
                  value={profile.preferred_model_id}
                  label="Preferred Model"
                  onChange={handleInputChange}
                >
                  <MenuItem value="gpt-4">GPT-4</MenuItem>
                  <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
                  <MenuItem value="claude-2">Claude 2</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="API Key"
                name="api_key"
                value={profile.api_key}
                onChange={handleInputChange}
                helperText="Leave empty to use default API key"
              />
            </Stack>
          </MainCard>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="large"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Save Profile
      </Button>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
      />
    </>
  );
}

export default Profile;