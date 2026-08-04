import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { clear as clearSaved } from './state/persistence';
import './styles/fonts.css';
import './styles/ludos.css';
import './styles/app.css';

// `?reset` wipes the save before the reducer hydrates — the only way back to
// onboarding once it's been completed. Companion to the `?screen=` deep links.
if (new URLSearchParams(window.location.search).has('reset')) clearSaved();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
