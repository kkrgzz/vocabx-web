import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import JWTContext from 'contexts/JWTContext';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';

const LanguageSelector = ({ languages, value, onChange, variant = 'select', label = 'Language', ...other }) => {
    const { user, isLoggedIn } = useContext(JWTContext);

    useEffect(()=>{
        if (!value && user?.profile?.target_language) {
            const lang = languages.find(lang => lang.code === user.profile.target_language);
            if (lang) {
                onChange(lang);
            }
        }
    }, [user, languages, value, onChange]);

    const defaultValue =
        value || null;


    if (variant === 'autocomplete') {
        return (
            <FormControl fullWidth {...other}>
                <Autocomplete
                    id="language-autocomplete"
                    options={languages}
                    getOptionLabel={(option) => `${option.name}`}
                    value={value || defaultValue}
                    onChange={(event, newValue) => onChange(newValue)}
                    isOptionEqualToValue={(option, val) => option.code === val?.code}
                    renderInput={(params) => (
                        <TextField {...params} label={label} variant="outlined" />
                    )}
                />
            </FormControl>
        );
    }
    return (
        <FormControl fullWidth {...other}>
            <InputLabel id="language-select-label">{label}</InputLabel>
            <Select
                labelId="language-select-label"
                id="language-select"
                value={value?.code || ''}
                onChange={(e) => {
                    const selected = languages.find(lang => lang.code === e.target.value);
                    onChange(selected);
                }}
            >
                {languages?.map(lang => (
                    <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

LanguageSelector.propTypes = {
    languages: PropTypes.array.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['select', 'autocomplete'])
};

export default LanguageSelector;