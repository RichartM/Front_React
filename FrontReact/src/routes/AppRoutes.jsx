import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Rutas públicas
import Login from '../pages/Auth/Login';
import RecuperarContraseña from "../pages/Auth/RecuperarContraseña";

// Para la Landing Page usamos el layout específico
import LandingPageLayout from '../layouts/LandingPageLayout';

// Páginas para Landing (el contenido que se renderiza dentro del layout)
import LandingPage from '../pages/LandingPage/LandingPage';
// Puedes renombrar o crear un componente LandingContent.jsx que contenga
// el contenido actual de tu landing (hero, Carrusel, secciones, etc.)

// Layouts para roles protegidos
import GerenteLayout from '../layouts/GerenteLayout';
import ClienteLayout from '../layouts/ClienteLayout';

// Páginas para Gerente
import CarTable from '../pages/Gerente/GerenteMarcaModelo';
import AgenteVentas from '../pages/Gerente/AgenteVentas';
import Servicios from '../pages/Gerente/Servicios';
import EditPerfil from '../pages/Gerente/EditPerfil';

// Páginas para Cliente
import ClienteHome from '../pages/Cliente/ClienteHome';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />

      {/* Ruta para Landing Page */}
     <Route path="/landing" element={<LandingPage />} />


      {/* Rutas protegidas para Gerente */}
      <Route path="/gerente" element={<GerenteLayout />}>
        <Route path="cartable" element={<CarTable />} />
        <Route path="agenteVentas" element={<AgenteVentas />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="editPerfil" element={<EditPerfil />} />
      </Route>

      {/* Rutas protegidas para Cliente */}
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route index element={<ClienteHome />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
