import React, { createContext, useState, useContext } from "react";
import AuthService from "../services/AgenteService/AuthServiceAgente";

const PerfilAgenteContext = createContext();

export const PerfilAgenteProvider = ({ children }) => {
  const [perfil, setPerfil] = useState({});

  const updatePerfil = async () => {
    try {
      const data = await AuthService.getUserProfile(); // Llama al método correcto
      setPerfil(data); // Actualiza el perfil con la data recibida
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <PerfilAgenteContext.Provider value={{ perfil, updatePerfil }}>
      {children}
    </PerfilAgenteContext.Provider>
  );
};

export const usePerfilAgente = () => useContext(PerfilAgenteContext);
