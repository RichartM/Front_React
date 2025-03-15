import React, { createContext, useState,useEffect } from "react";
import axios from "axios"




export const BrandsContext = createContext();

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8080/marcas/getAll')
      .then(response => {
        console.log("📢 Marcas obtenidas en BrandsContext:", response.data);
        setBrands(response.data);
      })
      .catch(error => {
        console.error("❌ Error al obtener marcas en BrandsContext:", error);
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