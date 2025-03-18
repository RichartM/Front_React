import React, { useState, useEffect } from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen
import axios from "axios"

const Card = () => {

  const [enEspera,setEnEspera] = useState([])

  const [total,setTotal] = useState([])





    //en espera
    useEffect(() => {
      console.log("get the useEffect")
      const token = localStorage.getItem('token');  // Obtener el token del localStorage
      console.log("token: "+token)
  
      if (token) {
        axios.get('http://localhost:8080/vehiculo/estados?estados=En espera', {
          headers: {
            Authorization: `Bearer ${token}`  // Usar el token en el encabezado
          }
        })
        .then(response => {
          setEnEspera(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
      } else {
        console.log('No se encontró el token');
      }
    }, []);




        //vendidos
        useEffect(() => {
          console.log("get the useEffect")
          const token = localStorage.getItem('token');  // Obtener el token del localStorage
          console.log("token: "+token)
      
          if (token) {
            axios.get('http://localhost:8080/vehiculo/estados?estados=Disponible', {
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
        <span className="card-number">{enEspera.length}</span>
        <p className="card-text">Autos en espera</p>
      </div>
    </div>
  );
};

export default Card;
