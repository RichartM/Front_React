// src/layouts/AgenteVentaLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
// Asegúrate de crear o ubicar el componente de navegación para Agente de Venta
import NavAgenteVenta from '../pages/AgenteVenta/NavAgenteVenta'; 

const AgenteVentaLayout = () => {
  return (
    <>
      <NavAgenteVenta />
      <div style={{ marginTop: '60px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default AgenteVentaLayout;
