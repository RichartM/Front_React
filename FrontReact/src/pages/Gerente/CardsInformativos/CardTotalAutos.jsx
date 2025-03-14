import React from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen

const CardTotalAutos = () => {
  return (
    <div className="card-container">
      <div
        className="image-background"
        style={{ backgroundImage: `url(${AutoCard})` }}
      ></div>
      <div className="card-content">
        <span className="card-number">34</span>
        <p className="card-text">Total autos</p>
      </div>
    </div>
  );
};

export default CardTotalAutos;
