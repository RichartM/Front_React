import React from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen
import axios from "axios"
import { useState, useEffect } from "react";

const CardAutosVendidos = () => {
  const [vendidos,setVendidos] = useState([])

        //vendidos
    useEffect(() => {
      console.log("get the useEffect")
      const token = localStorage.getItem('token');  // Obtener el token del localStorage
      console.log("token: "+token)
  
      if (token) {
        axios.get('https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/estados?estados=Vendido', {
          headers: {
            Authorization: `Bearer ${token}`  // Usar el token en el encabezado
          }
        })
        .then(response => {
          setVendidos(response.data);
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
        <span className="card-number">{vendidos.length}</span>
        <p className="card-text">Autos vendidos</p>
      </div>
    </div>
  );
};

export default CardAutosVendidos;
