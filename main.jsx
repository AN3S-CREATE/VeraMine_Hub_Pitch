import React from 'react';
import { createRoot } from 'react-dom/client';
import PitchDeck from 'virtual:pitchdeck';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PitchDeck />
  </React.StrictMode>
);
