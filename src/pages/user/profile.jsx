import {
  Avatar,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Box,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { getLanguages } from 'utils/crud/LanguageController';
import { getUserInformation } from 'utils/crud/UserController';
import { styled } from '@mui/material/styles';
import Toast from 'components/Toast';
import { Camera } from '@phosphor-icons/react';
import queryClient from 'utils/queryClient';
import RectangularSkeletonStack from 'components/RectangularSkeletonStack';
import LanguageSelector from 'components/LanguageSelector';

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `5px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.grey[300],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

function Profile() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    profile_image: '',
    mother_language: '',
    target_language: '',
    api_key: '',
    preferred_model_id: ''
  });
  const [newProfileImage, setNewProfileImage] = useState(null);

  const { data: languages, isLoading: isLanguagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: async () => getLanguages(),
  });

  const { data: userInformation } = useQuery({
    queryKey: ['userInformation'],
    queryFn: async () => getUserInformation(),
  });

  useEffect(() => {
    if (userInformation) {
      const user = userInformation?.user?.profile;
      setProfile({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        profile_image: user?.profile_image || '',
        mother_language: user?.mother_language || '',
        target_language: user?.target_language || '',
        api_key: user?.api_key || '',
        preferred_model_id: user?.preferred_model_id || ''
      });
    }
  }, [userInformation]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
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
      formData.append('_method', 'PUT');
      Object.keys(profile).forEach(key => {
        if (key !== 'profile_image') {
          formData.append(key, profile[key] || '');
        }
      });
      if (newProfileImage) {
        formData.append('profile_image', newProfileImage);
      }

      const response = await axios.post(`api/user/profile/${userInformation?.user?.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      queryClient.invalidateQueries('userInformation');
      setToast({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      setNewProfileImage(null);
    } catch (error) {
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error updating profile',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <ProfileCard>
        <Stack spacing={4}>
          {/* Header Section */}
          <Box textAlign="center" mb={2}>
            <StyledAvatar src={profile.profile_image}>
              {profile.first_name?.charAt(0)}
              {profile.last_name?.charAt(0)}
            </StyledAvatar>
            <IconButton
              color="primary"
              component="label"
              sx={{ mt: 2, bgcolor: 'background.paper' }}
            >
              <Camera />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </IconButton>
            <Typography variant="h5" mt={2}>
              {profile.first_name} {profile.last_name}
            </Typography>
          </Box>

          <Divider />

          {/* Personal Info */}
          <Box>
            <SectionTitle variant="h6">Personal Information</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleInputChange}
                  variant="filled"
                  sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleInputChange}
                  variant="filled"
                  sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Language Preferences */}
          <Box>
            <SectionTitle variant="h6">Language Preferences</SectionTitle>
            {
              !isLanguagesLoading
                ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <LanguageSelector
                        languages={languages}
                        value={languages.find(lang => lang.code === profile.mother_language) || null}
                        onChange={(newLang) =>
                          setProfile(prev => ({ ...prev, mother_language: newLang ? newLang.code : '' }))
                        }
                        variant="autocomplete"
                        label="Mother Language"
                        sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LanguageSelector
                        languages={languages}
                        value={languages.find(lang => lang.code === profile.target_language) || null}
                        onChange={(newLang) =>
                          setProfile(prev => ({ ...prev, target_language: newLang ? newLang.code : '' }))
                        }
                        variant="autocomplete"
                        label="Target Language"
                        sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <RectangularSkeletonStack />
                )
            }
          </Box>

          {/* API Settings */}
          <Box>
            <SectionTitle variant="h6">API Settings</SectionTitle>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Preferred Model</InputLabel>
                  <Select
                    name="preferred_model_id"
                    value={profile.preferred_model_id}
                    onChange={handleInputChange}
                    sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                  >
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="gpt-3.5">GPT-3.5</MenuItem>
                    <MenuItem value="claude-2">Claude 2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="API Key"
                  name="api_key"
                  value={profile.api_key}
                  onChange={handleInputChange}
                  variant="filled"
                  helperText="Leave empty for default"
                  sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Save Button */}
          <Box display="flex" justifyContent="center" pt={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{
                borderRadius: 8,
                px: 6,
                py: 1.5,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                },
              }}
            >
              Update Profile
            </Button>
          </Box>
        </Stack>
      </ProfileCard>

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