import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const PerfilGerenteContext = createContext();

export const PerfilGerenteProvider = ({ children }) => {
  const [state, setState] = useState({
    perfil: {
      name: '',
      lastname: '',
      surname: '',
      username: '',
      email: '',
      rol: '',
      // Agrega aquí cualquier otro campo necesario
    },
    loading: true,
    error: null,
    lastUpdate: null // Para controlar la última actualización
  });

  // Usamos useCallback para memoizar la función y evitar renders innecesarios
  const updatePerfil = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'No hay token disponible'
      }));
      return;
    }
  
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch("https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/perfilGerente", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Datos recibidos en updatePerfil:", data);
  
      // Actualizamos todos los campos del perfil
      setState({
        perfil: {
          name: data.name || '',
          lastname: data.lastname || '',
          surname: data.surname || '',
          username: data.username || '',
          email: data.email || '',
          rol: data.rol || '',
          // Actualiza aquí cualquier otro campo
        },
        loading: false,
        error: null,
        lastUpdate: new Date() // Marcamos el momento de la actualización
      });
      
    } catch (error) {
      console.error("Error cargando el perfil:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, []);

  // Cargamos el perfil al montar el componente
  useEffect(() => {
    updatePerfil();
  }, [updatePerfil]);

  return (
    <PerfilGerenteContext.Provider value={{
      perfil: state.perfil,
      updatePerfil,
      loading: state.loading,
      error: state.error,
      lastUpdate: state.lastUpdate // Exportamos lastUpdate para que otros componentes puedan usarlo
    }}>
      {children}
    </PerfilGerenteContext.Provider>
  );
};

export const usePerfilGerente = () => {
  const context = useContext(PerfilGerenteContext);
  if (!context) {
    throw new Error('usePerfilGerente debe usarse dentro de un PerfilGerenteProvider');
  }
  return context;
};