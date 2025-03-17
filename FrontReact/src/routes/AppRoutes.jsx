import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
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
import PanelControl from '../pages/Gerente/PanelControl';

// Cliente
import ClienteHome from '../pages/Cliente/ClienteHome';
import CarrosPorMarca from '../pages/Autos/CarrosPorMarca';
import DetallesCoche from '../pages/Autos/DetallesCoche';

// Agente
import TablaCliente from '../pages/AgenteVenta/TablaCliente';
import DetallesCocheAgente from '../pages/AgenteVenta/DetallesCocheAgente';
import ResumenCompra from '../pages/AgenteVenta/ResumenCompra.jsx'
const AppRoutes = () => {
  return (
    <Suspense fallback={<h1>Cargando...</h1>}>
      <Routes>
        {/* 🔹 Página de inicio - Redirigir a login si no está autenticado */}
        <Route path="/" element={<Navigate to="/login" replace />} />

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
        <Route path="/resumen-compra" element={<ResumenCompra />} />


        {/* 🔹 Rutas protegidas (GERENTES no requieren cambio de contraseña) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/gerente/*" element={<GerenteLayout />}>
            <Route path="cartable" element={<CarTable />} />
            <Route path="agenteVentas" element={<AgenteVentas />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="editPerfil" element={<EditPerfil />} />
            <Route path="panelControl" element={<PanelControl />} />
          </Route>
        </Route>

        {/* 🔹 Rutas protegidas con verificación de cambio de contraseña (AGENTES y CLIENTES) */}
        <Route element={<RequirePasswordChange />}>
          <Route element={<ProtectedRoute />}>
            {/* 🔹 Rutas para Agentes */}
            <Route path="/agente/*" element={<AgenteVentaLayout />}>
              <Route index element={<Navigate to="/agente/tablaCliente" replace />} />
              <Route path="tablaCliente" element={<TablaCliente />} />
            </Route>

            {/* 🔹 Rutas para Clientes */}
            <Route path="/cliente/*" element={<ClienteLayout />}>
              <Route index element={<Navigate to="/cliente/home" replace />} />
              <Route path="home" element={<ClienteHome />} />
              <Route path="editPerfil" element={<EditPerfil />} />
            </Route>
          </Route>
        </Route>

        {/* 🔹 Ruta 404 para cualquier otra dirección no definida */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;