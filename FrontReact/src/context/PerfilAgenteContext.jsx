// PerfilAgenteContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthServiceAgente from "../services/AgenteService/AuthServiceAgente";

const PerfilAgenteContext = createContext();

export const PerfilAgenteProvider = ({ children }) => {
  const [perfil, setPerfil] = useState(null);

  const updatePerfil = async () => {
    try {
      const data = await AuthServiceAgente.getUserProfile();
      setPerfil(data);
    } catch (error) {
      console.error("❌ Error cargando perfil del agente:", error);
    }
  };

  useEffect(() => {
    updatePerfil();
  }, []);

  return (
    <PerfilAgenteContext.Provider value={{ perfil, updatePerfil }}>
      {children}
    </PerfilAgenteContext.Provider>
  );
};

export const usePerfilAgente = () => useContext(PerfilAgenteContext);
