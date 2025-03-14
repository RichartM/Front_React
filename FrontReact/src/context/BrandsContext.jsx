import React, { createContext, useState,useEffect } from "react";
import axios from "axios"


  


export const BrandsContext = createContext();

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    console.log("get the useEffect")
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    console.log("token: "+token)

      axios.get('http://localhost:8080/Marcas/getAll', {

      })
      .then(response => {
        setBrands(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
   
  }, []);

  // Función para agregar una nueva marca  
  // (Más adelante reemplazas esto por una llamada a la API)
  const addBrand = (newBrand) => {
    setBrands((prev) => [...prev, newBrand]);
  };

  console.log("=======================brandss======================================")
  console.log(brands)

  return (
    <BrandsContext.Provider value={{ brands, addBrand }}>
      {children}
    </BrandsContext.Provider>
  );
};