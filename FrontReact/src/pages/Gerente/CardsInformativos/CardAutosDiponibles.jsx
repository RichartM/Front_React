import React from "react";
import { useState,useEffect } from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen
import axios from "axios"

const CardAutosDisponibles = () => {

    const [disponibles,setDisponibles] = useState([])
      //disponibles
      useEffect(() => {
        console.log("get the useEffect")
        const token = localStorage.getItem('token');  // Obtener el token del localStorage
        console.log("token: "+token)
    
        if (token) {
          axios.get('https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/estados?estados=Disponible', {
            headers: {
              Authorization: `Bearer ${token}`  // Usar el token en el encabezado
            }
          })
          .then(response => {
            setDisponibles(response.data);
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
        <span className="card-number">{disponibles.length}</span>
        <p className="card-text">Autos disponibles</p>
      </div>
    </div>
  );
};

export default CardAutosDisponibles;
