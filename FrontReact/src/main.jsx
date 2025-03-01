import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrandsProvider } from './context/BrandsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrandsProvider>
      <App />
    </BrandsProvider>
  </StrictMode>
);
