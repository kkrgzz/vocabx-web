import { Grid, Stack, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem, FormControl } from '@mui/material';

export default function StepThree({ values, handleBlur, handleChange, touched, errors, setFieldValue, languages }) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack spacing={1}>
                    <InputLabel htmlFor="profileImage">Profile Image</InputLabel>
                    <OutlinedInput
                        id="profileImage"
                        type="file"
                        name="profileImage"
                        onBlur={handleBlur}
                        onChange={(event) => {
                            setFieldValue('profileImage', event.currentTarget.files[0]);
                        }}
                        fullWidth
                        error={Boolean(touched.profileImage && errors.profileImage)}
                    />
                </Stack>
                {touched.profileImage && errors.profileImage && (
                    <FormHelperText error id="helper-text-profileImage">
                        {errors.profileImage}
                    </FormHelperText>
                )}
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="motherLanguage-label">Mother Language*</InputLabel>
                    <Select
                        labelId="motherLanguage-label"
                        id="motherLanguage"
                        value={values.motherLanguage}
                        name="motherLanguage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.motherLanguage && errors.motherLanguage)}
                    >
                        {
                            languages?.map(language => (
                                <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {touched.motherLanguage && errors.motherLanguage && (
                    <FormHelperText error id="helper-text-motherLanguage">
                        {errors.motherLanguage}
                    </FormHelperText>
                )}
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel id="targetLanguage-label">Target Language*</InputLabel>
                    <Select
                        labelId="targetLanguage-label"
                        id="targetLanguage"
                        value={values.targetLanguage}
                        name="targetLanguage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        fullWidth
                        error={Boolean(touched.targetLanguage && errors.targetLanguage)}
                    >
                        {
                            languages?.map(language => (
                                <MenuItem key={language.code} value={language.code}>{language.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                {touched.targetLanguage && errors.targetLanguage && (
                    <FormHelperText error id="helper-text-targetLanguage">
                        {errors.targetLanguage}
                    </FormHelperText>
                )}
            </Grid>
        </Grid>
    );
}