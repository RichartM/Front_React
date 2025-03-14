import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx'; // ✅ Proteger rutas
import RequirePasswordChange from '../components/RequirePasswordChange';

// Páginas públicas
import Login from '../pages/Auth/Login';
import RecuperarContraseña from "../pages/Auth/RecuperarContraseña";
import ResetPassword from "../pages/Auth/ResetPassword";
import ChangePassword from "../pages/Auth/ChangePassword";
import LandingPage from '../pages/LandingPage/LandingPage';

// Layouts protegidos
import GerenteLayout from '../layouts/GerenteLayout';
import ClienteLayout from '../layouts/ClienteLayout';
import AgenteVentaLayout from '../layouts/AgenteVentaLayout';

// Gerente
import CarTable from '../pages/Gerente/GerenteMarcaModelo';
import AgenteVentas from '../pages/Gerente/AgenteVentas';
import Servicios from '../pages/Gerente/Servicios';
import EditPerfil from '../pages/Gerente/EditPerfil';

// Cliente
import ClienteHome from '../pages/Cliente/ClienteHome';
import CarrosPorMarca from '../pages/Autos/CarrosPorMarca';
import DetallesCoche from '../pages/Autos/DetallesCoche.jsx';

// Agente
import TablaCliente from '../pages/AgenteVenta/TablaCliente.jsx';
import DetallesCocheAgente from '../pages/AgenteVenta/DetallesCocheAgente.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🔹 Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* 🔹 Rutas de marcas para Clientes y Agentes */}
      <Route path="/cliente/marca/:brandId" element={<CarrosPorMarca />} />
      <Route path="/agente/marca/:brandId" element={<CarrosPorMarca />} />

      {/* 🔹 Rutas de Detalle de Auto para Clientes y Agentes */}
      <Route path="/cliente/marca/:brandId/coche/:carId" element={<DetallesCoche />} />
      <Route path="/agente/marca/:brandId/coche/:carId" element={<DetallesCocheAgente />} />

      {/* 🔹 Rutas protegidas con verificación de contraseña */}
      <Route element={<RequirePasswordChange><ProtectedRoute /></RequirePasswordChange>}>
        <Route path="/gerente" element={<GerenteLayout />}>
          <Route path="cartable" element={<CarTable />} />
          <Route path="agenteVentas" element={<AgenteVentas />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="editPerfil" element={<EditPerfil />} />
        </Route>
      </Route>

      <Route element={<RequirePasswordChange><ProtectedRoute /></RequirePasswordChange>}>
        <Route path="/agente" element={<AgenteVentaLayout />}>
          <Route path="tablaCliente" element={<TablaCliente />} />
        </Route>
      </Route>

      <Route element={<RequirePasswordChange><ProtectedRoute /></RequirePasswordChange>}>
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<ClienteHome />} />
          <Route path="editPerfil" element={<EditPerfil />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
