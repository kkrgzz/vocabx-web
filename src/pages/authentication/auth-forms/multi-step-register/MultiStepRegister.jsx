import { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Box, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import axios from 'utils/axios';
import Toast from 'components/Toast';
import Loader from 'components/Loader';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

const steps = ['Account Details', 'Personal Information', 'Profile Details'];

const getLanguages = async () => {
    try {
        const response = await axios.get('api/languages');
        return response?.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
        setSnackbar({ open: true, message: 'Error fetching languages', severity: 'error' });
    }
}

const validationSchema = [
    Yup.object().shape({
        username: Yup.string().max(255).required('Username is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password Confirmation is required')
    }),
    Yup.object().shape({
        firstname: Yup.string().max(255).required('First Name is required'),
        lastname: Yup.string().max(255).required('Last Name is required')
    }),
    Yup.object().shape({
        profileImage: Yup.mixed(),
        motherLanguage: Yup.string().max(255).required('Mother Language is required'),
        targetLanguage: Yup.string().max(255).required('Target Language is required')
    })
];

export default function MultiStepRegister() {
    const [languages, setLanguages] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState();

    const handleCloseSnackbar = () => {
        setSnackbar({
            open: false
        });
    };

    const handleNext = async (values, { setErrors, setStatus, setSubmitting }) => {
        if (activeStep === 0) {
            setLoading(true);
            try {
                const response = await axios.post('/api/auth/register', {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                    password_confirmation: values.password_confirmation
                });
                const { serviceToken } = response.data;
                localStorage.setItem('serviceToken', serviceToken);
                axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
                setUserID(response?.id);
                setSnackbar({ open: true, message: 'Account Created. Please proceed to the next step.', severity: 'success' });
                setStatus({ success: true });
                setSubmitting(false);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                
                // Fetch and set languages
                const languages = await getLanguages();
                setLanguages(languages);
            } catch (error) {
                const message = error.response?.data?.message || 'Something went wrong';
                setSnackbar({ open: true, message, severity: 'error' });
                setStatus({ success: false });
                setErrors({ submit: message });
                setSubmitting(false);
            } finally {
                setLoading(false);
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('first_name', values.firstname);
            formData.append('last_name', values.lastname);
            formData.append('mother_language', values.motherLanguage);
            formData.append('target_language', values.targetLanguage);
            if (values.profileImage) {
                formData.append('profile_image', values.profileImage);
            }

            await axios.post(`/api/user/profile/${userID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setSnackbar({ open: true, message: 'Profile updated successfully.', severity: 'success' });
            setStatus({ success: true });
            setSubmitting(false);
            
            resetForm();
            setActiveStep(0);
            window.location.reload();

        } catch (error) {
            const message = error.response?.data?.message || 'Something went wrong';
            setSnackbar({ open: true, message, severity: 'error' });
            setStatus({ success: false });
            setErrors({ submit: message });
            setSubmitting(false);
        }
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            {loading && <Loader />}
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    firstname: '',
                    lastname: '',
                    profileImage: '',
                    motherLanguage: '',
                    targetLanguage: '',
                    submit: null
                }}
                validationSchema={validationSchema[activeStep]}
                onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
                {({ isSubmitting, errors, touched, handleBlur, handleChange, values, setFieldValue }) => (
                    <Form>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Box sx={{ mt: 2 }}>
                            {activeStep === steps.length ? (
                                <Typography variant="h6" align="center">
                                    All steps completed
                                </Typography>
                            ) : (
                                <>
                                    {activeStep === 0 && (
                                        <StepOne
                                            values={values}
                                            handleBlur={handleBlur}
                                            handleChange={(e) => {
                                                handleChange(e);
                                                if (e.target.name === 'password') {
                                                    changePassword(e.target.value);
                                                }
                                            }}
                                            touched={touched}
                                            errors={errors}
                                            level={level}
                                        />
                                    )}
                                    {activeStep === 1 && <StepTwo values={values} handleBlur={handleBlur} handleChange={handleChange} touched={touched} errors={errors} />}
                                    {activeStep === 2 && <StepThree values={values} handleBlur={handleBlur} handleChange={handleChange} touched={touched} errors={errors} setFieldValue={setFieldValue} languages={languages} />}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        {activeStep !== 0 && (
                                            <Button onClick={handleBack} sx={{ mr: 1 }}>
                                                Back
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
            <Toast open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={handleCloseSnackbar} />
        </>
    );
}