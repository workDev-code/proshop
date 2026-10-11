import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { App } from './App';
import { AppThemeProvider } from './theme/ThemeProvider';
import { store } from './store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <AppThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppThemeProvider>
    </ReduxProvider>
  </React.StrictMode>
);
