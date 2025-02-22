// src/layouts/GerenteLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavGerente from '../pages/Gerente/NavGerente' // Asegúrate de que la ruta sea correcta

const GerenteLayout = () => {
  return (
    <>
      <NavGerente />
      <div style={{ marginTop: '60px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default GerenteLayout;
