import { Grid, Stack, InputLabel, OutlinedInput, FormHelperText, FormControl, Box, Typography } from '@mui/material';

export default function StepOne({ values, handleBlur, handleChange, touched, errors, level }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="username-signup">Username*</InputLabel>
          <OutlinedInput
            id="username-signup"
            type="text"
            value={values.username}
            name="username"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Username"
            fullWidth
            error={Boolean(touched.username && errors.username)}
          />
        </Stack>
        {touched.username && errors.username && (
          <FormHelperText error id="helper-text-username-signup">
            {errors.username}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1}>
          <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
          <OutlinedInput
            id="email-signup"
            type="email"
            value={values.email}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="demo@company.com"
            fullWidth
            error={Boolean(touched.email && errors.email)}
          />
        </Stack>
        {touched.email && errors.email && (
          <FormHelperText error id="helper-text-email-signup">
            {errors.email}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <InputLabel htmlFor="password-signup">Password*</InputLabel>
          <OutlinedInput
            id="password-signup"
            type="password"
            value={values.password}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="******"
            fullWidth
            error={Boolean(touched.password && errors.password)}
          />
        </Stack>
        {touched.password && errors.password && (
          <FormHelperText error id="helper-text-password-signup">
            {errors.password}
          </FormHelperText>
        )}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" fontSize="0.75rem">
                {level?.label}
              </Typography>
            </Grid>
          </Grid>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <InputLabel htmlFor="passwordConfirmation-signup">Confirm Password*</InputLabel>
          <OutlinedInput
            id="passwordConfirmation-signup"
            type="password"
            value={values.password_confirmation}
            name="password_confirmation"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="******"
            fullWidth
            error={Boolean(touched.password_confirmation && errors.password_confirmation)}
          />
        </Stack>
        {touched.password_confirmation && errors.password_confirmation && (
          <FormHelperText error id="helper-text-passwordConfirmation-signup">
            {errors.password_confirmation}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  );
}