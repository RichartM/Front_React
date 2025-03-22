import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const PerfilClienteContext = createContext();

export const PerfilClienteProvider = ({ children }) => {
  const [perfil, setPerfil] = useState({});

  const updatePerfil = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/auth/perfilCliente", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerfil(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <PerfilClienteContext.Provider value={{ perfil, updatePerfil }}>
      {children}
    </PerfilClienteContext.Provider>
  );
};

export const usePerfilCliente = () => useContext(PerfilClienteContext); // Exporta el hook