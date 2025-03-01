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

// Gerente
import CarTable from '../pages/Gerente/GerenteMarcaModelo';
import AgenteVentas from '../pages/Gerente/AgenteVentas';
import Servicios from '../pages/Gerente/Servicios';
import EditPerfil from '../pages/Gerente/EditPerfil';

// Cliente
import ClienteHome from '../pages/Cliente/ClienteHome';
import CarrosPorMarca from '../pages/Cliente/CarrosPorMarca';
import DetallesCoche from '../pages/DetallesCoche'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/landing" element={<LandingPage />} />

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
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route index element={<ClienteHome />} />
          <Route path="marca/:brandId" element={<CarrosPorMarca />} />
          <Route path="editPerfil" element={<EditPerfil />} />
        </Route>
      </Route>

      <Route path="/marca/:brandId/coche/:carId" element={<DetallesCoche />} />
    </Routes>
  );
};

export default AppRoutes;
