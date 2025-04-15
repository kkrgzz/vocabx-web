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
  IconButton,
  Alert,
  CircularProgress,
  Switch
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
import OpenAI from 'openai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AIClientWrapper } from 'utils/ai';

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.2)',
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
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

const getOpenRouterModels = async () => {
  try {
    const url = "https://openrouter.ai/api/v1/models";
    const response = await axios.get(url);

    const freeModels = response?.data?.data.filter(model =>
      parseFloat(model.pricing.completion) === 0 &&
      parseFloat(model.pricing.prompt) === 0 &&
      parseFloat(model.pricing.request) === 0
    );

    return freeModels || [];
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
  }
}

function Profile() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const completion_endpoint = "https://openrouter.ai/api/v1/completions";
  const [aiPlaygroundText, setAiPlaygroundText] = useState('');
  const [aiPlaygroundResponse, setAiPlaygroundResponse] = useState('');
  const [aiPlaygroundResponseLoading, setAiPlaygroundResponseLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    profile_image: '',
    mother_language: '',
    target_language: '',
    is_ai_assistant_enabled: false,
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

  const { data: openRouterModels, isLoading: isOpenRouterModelsLoading } = useQuery({
    queryKey: ['openRouterModels'],
    queryFn: async () => getOpenRouterModels()
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
        is_ai_assistant_enabled: Boolean(user?.is_ai_assistant_enabled),
        api_key: user?.api_key || '',
        preferred_model_id: user?.preferred_model_id || ''
      });
    }
  }, [userInformation]);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value;

    setProfile(prev => ({ ...prev, [name]: newValue }));
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


      // Convert boolean to integer for Laravel
      const profileData = {
        ...profile,
        is_ai_assistant_enabled: profile.is_ai_assistant_enabled ? 1 : 0
      };

      Object.keys(profileData).forEach(key => {
        if (key !== 'profile_image') {
          formData.append(key, profileData[key] || '');
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

  /* const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: profile.api_key,
    dangerouslyAllowBrowser: true,
  }); */

  /* const handleAIPlaygroundClick = async () => {
    const startTime = performance.now();
    setAiPlaygroundResponseLoading(true);
    const completion = await openai.chat.completions.create({
      model: profile.preferred_model_id,
      messages: [
        {
          role: 'user',
          content: `Please format your response using Markdown.\n\nUser: ${aiPlaygroundText}`,
        },
      ],
    });
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`API call took ${(elapsedTime / 1000).toFixed(2)} seconds`);
    completion['elapsed_time'] = elapsedTime.toFixed(2);
    console.log(completion);
    //console.log(completion.choices[0].message);
    setAiPlaygroundResponseLoading(false);
    setAiPlaygroundResponse(completion.choices[0]?.message?.content || 'No response');
  } */

  const aiClient = new AIClientWrapper(profile.api_key, profile.preferred_model_id);

  const handleAIPlaygroundClick = async () => {
    try {
      const text = `Please format your response using Markdown.\n\nUser: ${aiPlaygroundText}`;
      setAiPlaygroundResponseLoading(true);
      const response = await aiClient.getCompletion(text);
      setAiPlaygroundResponse(response);
    } catch (error) {
      console.error('Error in AI Playground:', error);
    } finally {
      setAiPlaygroundResponseLoading(false);
    }
  };

  return (
    <>
      <ProfileContainer>
        <Stack spacing={4}>
          {/* Header Section */}
          <ProfileCard>
            <Box textAlign="center" mb={2}>
              <StyledAvatar src={profile.profile_image}>
                {profile.first_name?.charAt(0)}
                {profile.last_name?.charAt(0)}
              </StyledAvatar>

              <Button color='primary' component='label'
                sx={{ mt: 2, bgcolor: 'background.paper' }}>
                <Stack direction='column' alignItems='center' justifyContent='center'>
                  <Camera size={24} />
                  <Typography>Change Profile Image</Typography>
                </Stack>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
              <Typography variant="h5" mt={2}>
                {profile.first_name} {profile.last_name}
              </Typography>
            </Box>
          </ProfileCard>

          <Divider />

          {/* Personal Info */}
          <ProfileCard>
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
          </ProfileCard>

          {/* Language Preferences */}
          <ProfileCard>
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
          </ProfileCard>

          {/* API Settings */}
          {
            isOpenRouterModelsLoading
              ? (<RectangularSkeletonStack count={1} />)
              : (
                <ProfileCard>
                  <Box>
                    <SectionTitle variant="h6">AI Assistant Settings</SectionTitle>
                    <Grid item xs={12}>
                      Enable AI Assistant
                      <Switch
                        name='is_ai_assistant_enabled'
                        checked={profile.is_ai_assistant_enabled}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    {
                      profile.is_ai_assistant_enabled
                      && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Alert variant='filled' severity='warning'>
                                The application can currently only work with OpenRouter API keys.
                                The user is responsible for the billing of the API keys you will create via OpenRouter.
                                You can generate free-to-use AI keys via OpenRouter and use them as you wish.
                                You can use the <a href='https://openrouter.ai/models' target='_blank'>link here</a> to review the models.
                                Only free models are listed in the select box below.
                              </Alert>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <FormControl fullWidth variant="filled">
                                <InputLabel>Preferred Model</InputLabel>
                                <Select
                                  name="preferred_model_id"
                                  value={profile.preferred_model_id}
                                  onChange={handleInputChange}
                                  sx={{ bgcolor: 'grey.50', borderRadius: 2 }}
                                >
                                  {
                                    openRouterModels?.map(model => (
                                      <MenuItem key={model.id} value={model.id}>{model?.name}</MenuItem>
                                    ))
                                  }
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
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                value={aiPlaygroundText}
                                onChange={(e) => setAiPlaygroundText(e.target.value)}
                                label="AI Playground Text"
                                variant="filled"
                                multiline
                                rows={4}
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Button
                                variant='contained'
                                onClick={handleAIPlaygroundClick}>
                                Send
                              </Button>
                            </Grid>
                            {aiPlaygroundResponseLoading
                              ? (<CircularProgress />)
                              : (<Grid item xs={12}>
                                {
                                  aiPlaygroundResponse && <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4} lg={3}><Typography variant='caption'>Elapsed Time: {aiPlaygroundResponse?.elapsed_time} ms</Typography></Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}><Typography variant='caption'>Completion Tokens: {aiPlaygroundResponse?.usage?.completion_tokens}</Typography></Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}><Typography variant='caption'>Prompt Tokens: {aiPlaygroundResponse?.usage?.prompt_tokens}</Typography></Grid>
                                    <Grid item xs={12} sm={6} md={4} lg={3}><Typography variant='caption'>Total Tokens: {aiPlaygroundResponse?.usage?.total_tokens}</Typography></Grid>
                                  </Grid>
                                }
                                <Box>
                                  <Markdown remarkPlugins={[remarkGfm]}>{aiPlaygroundResponse?.content}</Markdown>
                                </Box>
                              </Grid>)
                            }
                          </Grid>
                        </>
                      )
                    }

                  </Box>
                </ProfileCard>
              )
          }

          {/* Save Button */}
          <ProfileCard>
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
          </ProfileCard>
        </Stack>
      </ProfileContainer>

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