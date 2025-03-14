import React from "react";
import "./Card.css"; // Archivo de estilos separado
import AutoCard from "../img/AutoCard.png"; // Importamos la imagen

const CardAutosVendidos = () => {
  return (
    <div className="card-container">
      <div
        className="image-background"
        style={{ backgroundImage: `url(${AutoCard})` }}
      ></div>
      <div className="card-content">
        <span className="card-number">34</span>
        <p className="card-text">Autos vendidos</p>
      </div>
    </div>
  );
};

export default CardAutosVendidos;
