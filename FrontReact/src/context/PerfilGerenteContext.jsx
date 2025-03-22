// src/context/PerfilGerenteContext.js
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const PerfilContext = createContext();

export const PerfilProvider = ({ children }) => {
  const [perfil, setPerfil] = useState({});

  const updatePerfil = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8080/api/auth/perfilCliente", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerfil(response.data); // Actualiza el estado con los nuevos datos
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <PerfilContext.Provider value={{ perfil, updatePerfil }}>
      {children}
    </PerfilContext.Provider>
  );
};

export const usePerfil = () => useContext(PerfilContext);