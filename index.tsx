import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AppWrapper />
    </I18nextProvider>
  </React.StrictMode>
);