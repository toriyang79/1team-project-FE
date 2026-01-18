import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { PlayerProvider } from './context/PlayerContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container #root not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
    </PlayerProvider>
  </React.StrictMode>,
);
