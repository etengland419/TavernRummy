import React from 'react';
import ReactDOM from 'react-dom/client';
import TavernRummy from './TavernRummy';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Tavern Rummy Error">
      <TavernRummy />
    </ErrorBoundary>
  </React.StrictMode>
);
