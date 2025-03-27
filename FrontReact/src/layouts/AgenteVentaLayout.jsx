import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavAgenteVenta from '../pages/AgenteVenta/NavAgenteVenta'; 
import { usePerfilAgente } from "../context/PerfilAgenteContext";

const AgenteVentaLayout = () => {
  const { perfil, cargarPerfil } = usePerfilAgente();

  useEffect(() => {
    // ✅ Solo cargar perfil si no está ya presente
    if (!perfil || !perfil.email) {
      cargarPerfil();
    }
  }, [perfil]); // Dependencia: si perfil cambia, se vuelve a verificar

  // 🔄 Mostrar loading mientras se obtiene el perfil
  if (!perfil || !perfil.email) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", color: "#018180" }}>
        Cargando perfil...
      </div>
    );
  }

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
