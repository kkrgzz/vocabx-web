import React from 'react';
import { useLanguage } from 'contexts/LanguageContext'; // Correct import
import { useIntl } from 'react-intl';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();
    const intl = useIntl();

    console.log(intl.formatMessage({ id: 'language' }));

    return (
        <FormControl variant="outlined" size="small">
            <InputLabel>{intl.formatMessage({ id: 'language' })}</InputLabel>
            <Select value={locale}
                onChange={(e) => setLocale(e.target.value)}
                label={intl.formatMessage({ id: 'language' })}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="tr">Türkçe</MenuItem>
            </Select>
        </FormControl>
    );
}