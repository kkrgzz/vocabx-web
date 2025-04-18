import React, { useState, useEffect, useMemo } from 'react';
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
  Alert,
  CircularProgress,
  Switch,
  IconButton,
  Tooltip
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material/styles';
import { Camera, Eraser } from '@phosphor-icons/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- ASSUMED IMPORTS ---
// Ensure these paths are correct for your project structure
import axios from 'utils/axios'; // Your configured axios instance
import queryClient from 'utils/queryClient'; // Your react-query client instance
import { getLanguages } from 'utils/crud/LanguageController'; // Your API function
import { getUserInformation } from 'utils/crud/UserController'; // Your API function
import apiKeyManager from 'utils/api-key-manager'; // Your ApiKeyManager instance
import { AIClientWrapper } from 'utils/ai'; // Your AI Client wrapper class
import Toast from 'components/Toast'; // Your Toast component
import RectangularSkeletonStack from 'components/RectangularSkeletonStack'; // Your Skeleton component
import LanguageSelector from 'components/LanguageSelector'; // Your LanguageSelector component
// ------------------------

// --- Styled Components ---

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2, // Slightly larger radius
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[6],
}));

const ProfileContainer = styled(Box)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: '0 auto',
  border: `5px solid ${theme.palette.primary.light}`,
  backgroundColor: theme.palette.grey[300],
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  paddingBottom: theme.spacing(1),
}));

// --- Helper to Fetch OpenRouter Models ---

const getOpenRouterModels = async () => {
  try {
    const url = "https://openrouter.ai/api/v1/models";
    const response = await axios.get(url);

    const freeModels = response?.data?.data.filter(model =>
      model?.pricing &&
      parseFloat(model.pricing.completion || 0) === 0 &&
      parseFloat(model.pricing.prompt || 0) === 0 &&
      parseFloat(model.pricing.request || 0) === 0
    );

    return freeModels || [];
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return []; // Return empty array on error
  }
};

// --- Profile Component ---

function Profile() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // State for general profile fields
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    profile_image: '',
    mother_language: '',
    target_language: '',
    is_ai_assistant_enabled: false,
    preferred_model_id: ''
  });

  // State specifically for API Key Management
  const [apiKeyInput, setApiKeyInput] = useState(''); // Holds user input for the key field
  const [originalEncryptedData, setOriginalEncryptedData] = useState(null); // Stores { ciphertext, salt, iv } from DB
  const [isApiKeySet, setIsApiKeySet] = useState(false); // Flag: true if a key is currently saved
  const [apiKeyAction, setApiKeyAction] = useState('keep'); // 'keep', 'update', 'remove' - Tracks user intent for the API key

  // State for new profile image upload
  const [newProfileImage, setNewProfileImage] = useState(null); // Holds the File object

  // AI Playground State
  const [aiPlaygroundText, setAiPlaygroundText] = useState('');
  const [aiPlaygroundResponse, setAiPlaygroundResponse] = useState(null); // Can hold response object or null/error
  const [aiPlaygroundResponseLoading, setAiPlaygroundResponseLoading] = useState(false);

  // --- React Query Hooks ---
  const { data: languages, isLoading: isLanguagesLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
    staleTime: 1000 * 60 * 60,
  });

  const { data: userInformation, isLoading: isUserLoading } = useQuery({
    queryKey: ['userInformation'],
    queryFn: getUserInformation,
  });

  const { data: openRouterModels, isLoading: isOpenRouterModelsLoading } = useQuery({
    queryKey: ['openRouterModels'],
    queryFn: getOpenRouterModels,
    staleTime: 1000 * 60 * 30,
    enabled: !!profile.is_ai_assistant_enabled, // Ensure enabled is strictly boolean
  });

  // --- Effect to Populate State from Loaded User Data ---
  useEffect(() => {
    if (userInformation?.user?.profile) {
      const userProfile = userInformation.user.profile;
      setProfile({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        profile_image: userProfile.profile_image || '',
        mother_language: userProfile.mother_language || '',
        target_language: userProfile.target_language || '',
        is_ai_assistant_enabled: Boolean(userProfile.is_ai_assistant_enabled),
        preferred_model_id: userProfile.preferred_model_id || ''
      });

      // Check and store original encrypted API key data
      if (userProfile.api_key && userProfile.api_salt && userProfile.api_iv) {
        const encryptedBundle = {
          ciphertext: userProfile.api_key,
          salt: userProfile.api_salt,
          iv: userProfile.api_iv
        };
        setOriginalEncryptedData(encryptedBundle);
        setIsApiKeySet(true);
      } else {
        setOriginalEncryptedData(null);
        setIsApiKeySet(false);
      }

      // Reset fields that track user interaction within the form session
      setApiKeyInput('');
      setNewProfileImage(null);
      setApiKeyAction('keep'); // Reset action intent on data load/reload

    }
  }, [userInformation]); // Dependency: only run when userInformation changes


  // --- Memoized AI Client ---
  const aiClient = useMemo(() => {
    let decryptedKey = null;
    if (originalEncryptedData) {
      try {
        decryptedKey = apiKeyManager.decrypt(originalEncryptedData);
        if (!decryptedKey) {
          console.error("Decryption failed for existing API key. Check app secret or data integrity.");
          // Consider showing a toast/alert if decryption fails persistently
        }
      } catch (error) {
        console.error("Error during API key decryption:", error);
      }
    }
    // Initialize wrapper - it should handle null key internally
    return new AIClientWrapper(decryptedKey, profile.preferred_model_id);
  }, [originalEncryptedData, profile.preferred_model_id]); // Dependencies

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Handle AI disable toggle specifically
    if (name === 'is_ai_assistant_enabled') {
      if (!newValue && isApiKeySet) {
        // If disabling AI and a key *is* currently set, mark the key for removal
        setApiKeyAction('remove');
        setApiKeyInput(''); // Clear the input as well for consistency
      } else if (newValue && apiKeyAction === 'remove' && !apiKeyInput) {
        // If re-enabling AI and it was just marked for removal (e.g., toggled off then on without saving/typing),
        // revert the action to 'keep'. If the user starts typing later, it will become 'update'.
        setApiKeyAction('keep');
      }
    }

    setProfile(prev => ({ ...prev, [name]: newValue }));
  };

  const handleApiKeyInputChange = (e) => {
    const currentValue = e.target.value;
    setApiKeyInput(currentValue);

    // Mark for update only if user types something into the field
    if (currentValue) {
      setApiKeyAction('update');
    } else if (apiKeyAction === 'update') {
      // If they *were* updating (action='update') and deleted everything back to empty,
      // revert the action to 'keep'. Explicit removal is handled by the clear button.
      setApiKeyAction('keep');
    }
    // If action was 'remove' or 'keep', deleting to empty doesn't change the action.
  };

  const handleClearApiKey = () => {
    setApiKeyInput(''); // Clear the input field visually
    setApiKeyAction('remove'); // Explicitly mark for removal
    setToast({ open: true, message: 'API Key marked for removal on save.', severity: 'info' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewProfileImage(file); // Store the file object
      const reader = new FileReader();
      reader.onloadend = () => { setProfile(prev => ({ ...prev, profile_image: reader.result })); }; // Update preview
      reader.readAsDataURL(file);
    } else if (file) {
      setToast({ open: true, message: 'Please select a valid image file.', severity: 'warning' });
    }
  };

  // Contains the actual logic for preparing data and making the API call
  const processProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    let apiKeyDataToSend = {}; // Holds api_key, api_salt, api_iv *only if* they need updating

    // Determine API key data based on the explicit action state
    if (apiKeyAction === 'update') {
      if (!apiKeyInput.trim()) { // Add trim() check
        setToast({ open: true, message: 'API Key cannot be empty when updating.', severity: 'warning' });
        return; // Prevent saving empty key when intending to update
      }
      console.log("Encrypting updated API key...");
      const encryptedBundle = apiKeyManager.encrypt(apiKeyInput);
      if (encryptedBundle) {
        apiKeyDataToSend = { api_key: encryptedBundle.ciphertext, api_salt: encryptedBundle.salt, api_iv: encryptedBundle.iv };
      } else {
        setToast({ open: true, message: 'Failed to encrypt the API key.', severity: 'error' });
        return; // Stop submission
      }
    } else if (apiKeyAction === 'remove') {
      console.log("Signaling API key removal...");
      apiKeyDataToSend = { api_key: '', api_salt: '', api_iv: '' };
    }
    // If apiKeyAction === 'keep', apiKeyDataToSend remains empty.

    // Append general profile data
    Object.keys(profile).forEach(key => {
      if (key !== 'profile_image') {
        const value = key === 'is_ai_assistant_enabled' ? (profile[key] ? 1 : 0) : profile[key];
        formData.append(key, value ?? ''); // Handle null/undefined
      }
    });

    // Append API key data *only* if an action occurred ('update' or 'remove')
    Object.keys(apiKeyDataToSend).forEach(key => {
      formData.append(key, apiKeyDataToSend[key]);
    });

    // Append new profile image file if it exists
    if (newProfileImage) {
      formData.append('profile_image', newProfileImage, newProfileImage.name);
    }

    // Send Request
    try {
      setToast({ open: true, message: 'Updating profile...', severity: 'info' });
      await axios.post(`api/user/profile/${userInformation?.user?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // SUCCESS: Invalidate query to refresh data
      // This triggers the useEffect, which will reset apiKeyAction to 'keep' among other things
      await queryClient.invalidateQueries({ queryKey: ['userInformation'] }); // ensure await if needed

      setToast({ open: true, message: 'Profile updated successfully!', severity: 'success' });

    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Error updating profile. Please try again.',
        severity: 'error'
      });
    }
  };

  // Form Submission Handler (prevents default, calls the processing function)
  const handleFormSubmit = (event) => {
    event.preventDefault();
    processProfileUpdate();
  };

  // AI Playground Handler
  const handleAIPlaygroundClick = async () => {
    // Assume AIClientWrapper has an isReady method or similar check
    if (!aiClient || !aiClient.isReady()) {
      setToast({ open: true, message: 'AI Client not ready. Please ensure a valid API key is saved.', severity: 'warning' });
      return;
    }
    if (!aiPlaygroundText.trim()) {
      setToast({ open: true, message: 'Please enter text to send to the AI.', severity: 'warning' });
      return;
    }

    try {
      const textToSend = `Please format your response using Markdown.\n\nUser: ${aiPlaygroundText}`;
      setAiPlaygroundResponseLoading(true);
      setAiPlaygroundResponse(null);

      const response = await aiClient.getCompletion(textToSend); // Ensure getCompletion exists
      setAiPlaygroundResponse(response);

    } catch (error) {
      console.error('Error in AI Playground:', error);
      setAiPlaygroundResponse({ content: `**Error:**\n\n${error.message || 'An unexpected error occurred.'}` });
      setToast({ open: true, message: `AI request failed: ${error.message}`, severity: 'error' });
    } finally {
      setAiPlaygroundResponseLoading(false);
    }
  };


  // --- Render Logic ---

  if (isUserLoading) { // Only need user loading check for main skeleton
    return (
      <ProfileContainer>
        <RectangularSkeletonStack count={5} />
      </ProfileContainer>
    );
  }

  return (
    <>
      <ProfileContainer>
        {/* Header Section (outside the form) */}
        <ProfileCard sx={{ mb: 4 }}>
          <Box textAlign="center" mb={3}>
            <StyledAvatar src={profile.profile_image || undefined} alt={`${profile.first_name} ${profile.last_name}`}>
              {profile.first_name?.charAt(0).toUpperCase()}
              {profile.last_name?.charAt(0).toUpperCase()}
            </StyledAvatar>
            <Button color='primary' variant='outlined' component='label' startIcon={<Camera size={20} />} sx={{ mt: 2 }}>
              Change Image
              <input type="file" hidden accept="image/png, image/jpeg, image/gif" onChange={handleFileUpload} />
            </Button>
            <Typography variant="h5" mt={2} fontWeight="medium">
              {profile.first_name} {profile.last_name}
            </Typography>
          </Box>
        </ProfileCard>

        {/* Form Wrapper for Editable Fields */}
        <form onSubmit={handleFormSubmit}>
          <Stack spacing={4}>

            {/* Personal Info */}
            <ProfileCard>
              <Box>
                <SectionTitle variant="h6">Personal Information</SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="First Name" name="first_name" value={profile.first_name} onChange={handleInputChange} variant="outlined" required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Last Name" name="last_name" value={profile.last_name} onChange={handleInputChange} variant="outlined" required />
                  </Grid>
                </Grid>
              </Box>
            </ProfileCard>

            {/* Language Preferences */}
            <ProfileCard>
              <Box>
                <SectionTitle variant="h6">Language Preferences</SectionTitle>
                {isLanguagesLoading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <LanguageSelector
                        languages={languages || []}
                        value={languages?.find(lang => lang.code === profile.mother_language) || null}
                        onChange={(newLang) => setProfile(prev => ({ ...prev, mother_language: newLang ? newLang.code : '' }))}
                        label="Mother Language"
                      // Pass loading prop correctly if LanguageSelector expects it
                      // loading={isLanguagesLoading}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LanguageSelector
                        languages={languages || []}
                        value={languages?.find(lang => lang.code === profile.target_language) || null}
                        onChange={(newLang) => setProfile(prev => ({ ...prev, target_language: newLang ? newLang.code : '' }))}
                        label="Target Language"
                      // Pass loading prop correctly if LanguageSelector expects it
                      // loading={isLanguagesLoading}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </ProfileCard>

            {/* AI Assistant Settings */}
            <ProfileCard>
              <Box>
                <SectionTitle variant="h6">AI Assistant Settings</SectionTitle>
                <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}> {/* Added margin bottom */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Enable AI Features</Typography>
                    <Switch name='is_ai_assistant_enabled' checked={!!profile.is_ai_assistant_enabled} onChange={handleInputChange} color="primary" />
                  </Stack>
                </FormControl>

                {/* Conditional Section for AI settings */}
                {profile.is_ai_assistant_enabled && (
                  <Box mt={1}> {/* Reduced margin top */}
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Alert variant='outlined' severity='warning' icon={false}>
                          AI features currently utilize OpenRouter. API key usage may incur costs based on OpenRouter's pricing for the selected model. You are responsible for managing your OpenRouter account and billing. Free models are available and listed below. Review models <a href='https://openrouter.ai/models' target='_blank' rel="noopener noreferrer" style={{ color: 'inherit' }}>here</a>.
                        </Alert>
                      </Grid>

                      {/* Model Selection */}
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="preferred-model-label">Preferred Model</InputLabel>
                          <Select
                            labelId="preferred-model-label"
                            label="Preferred Model"
                            name="preferred_model_id"
                            value={!isOpenRouterModelsLoading && openRouterModels?.some(model => model.id === profile.preferred_model_id) ? profile.preferred_model_id : ''}
                            onChange={handleInputChange}
                            disabled={isOpenRouterModelsLoading || !profile.is_ai_assistant_enabled}
                          >
                            {isOpenRouterModelsLoading && <MenuItem value="" disabled><em>Loading models...</em></MenuItem>}
                            {!isOpenRouterModelsLoading && !openRouterModels?.length && profile.is_ai_assistant_enabled && <MenuItem value="" disabled><em>No free models found</em></MenuItem>}
                            {!profile.is_ai_assistant_enabled && <MenuItem value="" disabled><em>Enable AI Assistant first</em></MenuItem>}
                            {openRouterModels?.map(model => (
                              <MenuItem key={model.id} value={model.id}>
                                {model?.name || model.id}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* API Key Input */}
                      <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                          <TextField
                            fullWidth
                            label="OpenRouter API Key"
                            name="api_key_input"
                            type="password"
                            value={apiKeyInput}
                            onChange={handleApiKeyInputChange}
                            variant="outlined"
                            placeholder={isApiKeySet ? "Enter new key to replace" : "sk-or-..."}
                            helperText={isApiKeySet ? "Key is set. Leave blank or clear to keep it." : "Enter your key from OpenRouter."}
                            InputLabelProps={{ shrink: true }}
                          />
                          {isApiKeySet && (
                            <Tooltip title="Mark API Key for Removal">
                              <span>
                                <IconButton onClick={handleClearApiKey} color={apiKeyAction === 'remove' ? 'error' : 'warning'} size="medium" sx={{ mt: 1 }}>
                                  <Eraser size={22} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* AI Playground Section */}
                    {isApiKeySet && apiKeyAction !== 'remove' ? ( // Show playground only if key is set and not marked for removal
                      <Box mt={4}>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                          Test Your Setup (AI Playground)
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField value={aiPlaygroundText} onChange={(e) => setAiPlaygroundText(e.target.value)} label="Enter text to send to the AI" variant="outlined" multiline rows={3} fullWidth />
                          </Grid>
                          <Grid item xs={12}>
                            <Button variant='contained' color="secondary" onClick={handleAIPlaygroundClick} disabled={aiPlaygroundResponseLoading || !aiPlaygroundText.trim()} startIcon={aiPlaygroundResponseLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                              {aiPlaygroundResponseLoading ? "Sending..." : "Test AI"}
                            </Button>
                          </Grid>
                          {(aiPlaygroundResponseLoading || aiPlaygroundResponse) && (
                            <Grid item xs={12}>
                              <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, minHeight: 100, maxHeight: 400, overflowY: 'auto', bgcolor: 'grey.50', whiteSpace: 'pre-wrap' }}> {/* Added whiteSpace */}
                                {aiPlaygroundResponseLoading && !aiPlaygroundResponse && (<Typography color="textSecondary">Waiting for AI response...</Typography>)}
                                {aiPlaygroundResponse && (
                                  <>
                                    {aiPlaygroundResponse.usage && (<Typography variant='caption' display="block" color="textSecondary" gutterBottom> Time: {aiPlaygroundResponse.elapsed_time} ms | Tokens: C={aiPlaygroundResponse.usage.completion_tokens}, P={aiPlaygroundResponse.usage.prompt_tokens}, T={aiPlaygroundResponse.usage.total_tokens} </Typography>)}
                                    <Markdown remarkPlugins={[remarkGfm]}>{aiPlaygroundResponse?.content || ''}</Markdown>
                                  </>
                                )}
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    ) : (profile.is_ai_assistant_enabled &&
                      <Alert severity={apiKeyAction === 'remove' ? 'warning' : 'info'} sx={{ mt: 3 }}>
                        {apiKeyAction === 'remove'
                          ? 'API Key will be removed on save. Save changes to proceed.'
                          : 'Please enter and save your OpenRouter API key to enable the AI playground and features.'}
                      </Alert>
                    )}
                  </Box>
                )}
              </Box>
            </ProfileCard>

            {/* Save Button */}
            <ProfileCard>
              <Box display="flex" justifyContent="flex-end" pt={1}>
                <Button variant="contained" color="primary" size="large" type="submit" sx={{ borderRadius: 2, px: 4 }}>
                  Save Changes
                </Button>
              </Box>
            </ProfileCard>

          </Stack>
        </form>
      </ProfileContainer>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </>
  );
}

export default Profile;