import React, { createContext, useContext, useState, useEffect } from "react";
import AuthServiceAgente from "../services/AgenteService/AuthServiceAgente";

// Creamos el contexto
const PerfilAgenteContext = createContext();

// Provider del contexto
export const PerfilAgenteProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null);

  // Función para cargar el perfil desde el servicio
  const loadPerfil = async () => {
    try {
      const data = await AuthServiceAgente.getUserProfile();
      setPerfil(data);
    } catch (err) {
      console.error("❌ Error cargando perfil del agente:", err);
    }
  };

  // Cargar perfil al montar el provider
  useEffect(() => {
    loadPerfil();
  }, []);

  return (
    <PerfilAgenteContext.Provider value={{ perfil, cargarPerfil: loadPerfil }}>
      {children}
    </PerfilAgenteContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const usePerfilAgente = () => useContext(PerfilAgenteContext);
