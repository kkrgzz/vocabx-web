import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// auth-provider
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { QueryClientProvider } from '@tanstack/react-query';

import queryClient from 'utils/queryClient';
// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
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
  );
}
