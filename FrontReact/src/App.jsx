// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { PerfilProvider } from "./context/PerfilGerenteContext"; // Contexto para gerentes
import { PerfilClienteProvider } from "./context/PerfilClienteContext"; // Contexto para clientes
import { PerfilAgenteProvider } from "./context/PerfilAgenteContext"; // Contexto para agentes

function App() {
  return (
    <React.StrictMode>
      {/* Proveedor para gerentes */}
      <PerfilProvider>
        {/* Proveedor para clientes */}
        <PerfilClienteProvider>
          {/* Proveedor para agentes */}
          <PerfilAgenteProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </PerfilAgenteProvider>
        </PerfilClienteProvider>
      </PerfilProvider>
    </React.StrictMode>
  );
}

export default App;