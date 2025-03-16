import { Grid, Stack, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';

export default function StepTwo({ values, handleBlur, handleChange, touched, errors }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
          <OutlinedInput
            id="firstname-signup"
            type="text"
            value={values.firstname}
            name="firstname"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="John"
            fullWidth
            error={Boolean(touched.firstname && errors.firstname)}
          />
        </Stack>
        {touched.firstname && errors.firstname && (
          <FormHelperText error id="helper-text-firstname-signup">
            {errors.firstname}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack spacing={1}>
          <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
          <OutlinedInput
            id="lastname-signup"
            type="text"
            value={values.lastname}
            name="lastname"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Doe"
            fullWidth
            error={Boolean(touched.lastname && errors.lastname)}
          />
        </Stack>
        {touched.lastname && errors.lastname && (
          <FormHelperText error id="helper-text-lastname-signup">
            {errors.lastname}
          </FormHelperText>
        )}
      </Grid>
    </Grid>
  );
}