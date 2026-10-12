import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { App } from './App';
import { AppThemeProvider } from './theme/ThemeProvider';
import { ToastProvider } from './hooks/useToast';
import { store } from './store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AppThemeProvider>
        <ToastProvider>
          <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <App />
          </BrowserRouter>
        </ToastProvider>
      </AppThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
);
