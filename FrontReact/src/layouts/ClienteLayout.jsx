import React from 'react';
import { Outlet } from 'react-router-dom';
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
