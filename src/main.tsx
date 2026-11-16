import { queryClient } from '@/services/QueryClient.ts';
import { ThemeContext } from '@emotion/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from './context/SnackbarContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import AuthProvider from '@/modules/_auth/context/AuthProvider.tsx';
import theme from './themes/theme.ts';
import '@/common/util/i18n.ts';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeContext value={theme}>
        <SnackbarProvider>
          <NotificationProvider>
            <AuthProvider>
              <BrowserRouter>
                <CssBaseline />
                <App />
              </BrowserRouter>
            </AuthProvider>
          </NotificationProvider>
        </SnackbarProvider>
      </ThemeContext>
    </QueryClientProvider>
  </HelmetProvider>
);
