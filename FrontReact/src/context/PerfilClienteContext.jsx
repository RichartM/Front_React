import React, { createContext, useState, useContext, useCallback } from "react";
import axios from "axios";

const PerfilClienteContext = createContext();

export const PerfilClienteProvider = ({ children }) => {
  const [perfil, setPerfil] = useState({});

  const updatePerfil = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/perfilCliente", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (JSON.stringify(response.data) !== JSON.stringify(perfil)) {
        setPerfil(response.data);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, [perfil]);

  return (
    <PerfilClienteContext.Provider value={{ perfil, updatePerfil }}>
      {children}
    </PerfilClienteContext.Provider>
  );
};

export const usePerfilCliente = () => useContext(PerfilClienteContext);
