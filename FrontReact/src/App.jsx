// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { PerfilGerenteProvider } from "./context/PerfilGerenteContext"; // Updated import name
import { PerfilClienteProvider } from "./context/PerfilClienteContext";
import { PerfilAgenteProvider } from "./context/PerfilAgenteContext";

function App() {
  return (
    <React.StrictMode>
      {/* Updated provider name to match export */}
      <PerfilGerenteProvider>
        <PerfilClienteProvider>
          <PerfilAgenteProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PerfilAgenteProvider>
        </PerfilClienteProvider>
      </PerfilGerenteProvider>
    </React.StrictMode>
  );
}

export default App;