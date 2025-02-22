// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Rutas públicas (se recomienda mover estos componentes a src/pages/Auth)
import Login from '../pages/Auth/Login';
import FormRegistro from '../pages/Auth/FormRegistro';

// Rutas protegidas para el rol Gerente
import GerenteLayout from '../layouts/GerenteLayout';
import Home from '../pages/Cliente/Home';
import CarTable from '../pages/Gerente/GerenteMarcaModelo';
import AgenteVentas from '../pages/Gerente/AgenteVentas';
import Servicios from '../pages/Gerente/Servicios';
import EditPerfil from '../pages/Gerente/EditPerfil';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<FormRegistro />} />

      {/* Rutas protegidas dentro del layout de Gerente */}
      <Route path="/" element={<GerenteLayout />}>
        <Route path="cartable" element={<CarTable />} />
        <Route path="agenteVentas" element={<AgenteVentas />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="editPerfil" element={<EditPerfil />} />
        {/* Ruta adicional, si se requiere */}
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
