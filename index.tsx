import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Landing from './pages/Landing';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
const isLanding = window.location.hash.startsWith('#/landing');
root.render(
  <React.StrictMode>
    {isLanding ? <Landing /> : <App />}
  </React.StrictMode>
);