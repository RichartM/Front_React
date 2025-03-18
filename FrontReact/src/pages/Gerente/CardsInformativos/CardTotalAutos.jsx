import React from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen
import axios from "axios"
import { useState,useEffect } from "react";

const CardTotalAutos = () => {

  const [total,setTotal] = useState([])
  
          //vendidos
      useEffect(() => {
        console.log("get the useEffect")
        const token = localStorage.getItem('token');  // Obtener el token del localStorage
        console.log("token: "+token)
    
        if (token) {
          axios.get('http://localhost:8080/vehiculo/estados?estados=disponible&estados=En espera', {
            headers: {
              Authorization: `Bearer ${token}`  // Usar el token en el encabezado
            }
          })
          .then(response => {
            setTotal(response.data);
            console.log(response.data)
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
          });
        } else {
          console.log('No se encontró el token');
        }
      }, []);
  return (
    <div className="card-container">
      <div
        className="image-background"
        style={{ backgroundImage: `url(${AutoCard})` }}
      ></div>
      <div className="card-content">
        <span className="card-number">{total.length}</span>
        <p className="card-text">Total autos</p>
      </div>
    </div>
  );
};

export default CardTotalAutos;
