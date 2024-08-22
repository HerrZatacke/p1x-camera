import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/components/App';
import '../scss/index.scss';
import WebUSBProvider from './app/components/WebUSBProvider';

document.addEventListener('DOMContentLoaded', async () => {
  const appRoot = document.getElementById('app');
  if (!appRoot) {
    return;
  }


  const root = createRoot(appRoot);

  root.render(<WebUSBProvider><App /></WebUSBProvider>);
});
