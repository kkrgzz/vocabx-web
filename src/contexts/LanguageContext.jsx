import React from 'react';

export const LanguageContext = React.createContext({
  locale: 'en',
  setLocale: () => {}
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = React.useState('en');

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};