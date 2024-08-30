import React from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { lightBlue } from '@mui/material/colors';
import App from './app/components/App';
import '../scss/index.scss';
import WebUSBProvider from './app/components/WebUSBProvider';

document.addEventListener('DOMContentLoaded', async () => {
  const appRoot = document.body;
  if (!appRoot) {
    return;
  }

  const theme = createTheme({
    palette: {
      primary: lightBlue,
      secondary: {
        main: '#eee',
        light: '#fff',
        dark: '#ccc',
        contrastText: '#666',
      },
    },
  });

  const root = createRoot(appRoot);

  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <WebUSBProvider>
          <App />
        </WebUSBProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
});
