import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { QueryClientProvider } from '@tanstack/react-query';

import queryClient from 'utils/queryClient';
import { useLanguage } from 'contexts/LanguageContext';
import { IntlProvider } from 'react-intl';
// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //


// Import Locale Data
import enMessages from './utils/locales/en.json';
import trMessages from './utils/locales/tr.json';
import { flatten } from 'flat';

export default function App() {
  const { locale } = useLanguage();

  const messages = {
    en: enMessages,
    tr: trMessages
  }

  return (
    <IntlProvider
      locale={locale}
      messages={flatten(messages[locale])}
      defaultLocale='en'
    >
      <ThemeCustomization>
        <ScrollTop>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <>
                <RouterProvider router={router} />
              </>
            </AuthProvider>
          </QueryClientProvider>
        </ScrollTop>
      </ThemeCustomization>
    </IntlProvider>
  );
}
