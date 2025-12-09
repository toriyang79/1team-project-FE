import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PlayerProvider } from './context/PlayerContext';

const rootElement = document.getElementById('app');

if (!rootElement) {
  throw new Error('Root container #app not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </React.StrictMode>,
);
