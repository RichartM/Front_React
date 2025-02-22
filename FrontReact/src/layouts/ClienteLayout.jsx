// src/layouts/ClienteLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// Asegúrate de crear o ubicar el componente de navegación para Cliente
import NavCliente from '../pages/Cliente/NavCliente'; 

const ClienteLayout = () => {
  return (
    <>
      <NavCliente />
      <div style={{ marginTop: '60px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default ClienteLayout;
