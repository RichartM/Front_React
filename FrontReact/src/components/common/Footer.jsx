import React from "react";
import Ford from "../../img/FordLogo.png";
import Chevrolet from "../../img/CheverletLogo.png"; 
import Mercedes from "../../img/MercedesLogo.png"; 
import Honda from "../../img/HondaLogo.png"; 
import BMW from "../../img/BMWLogo.png"; 


const Footer = () => {
  return (
    <footer
      className="text-center p-4"
      style={{
        backgroundColor: "#343a40",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
     
      {/* Información del footer */}
      <p>© 2023 SEGA. Todos los derechos reservados.</p>
      <p>Contacto: info@sega.com | Teléfono: +123 456 789</p>
       {/* Contenedor de imágenes en una sola línea */}
       <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "10px" }}>
       <img src={Mercedes} alt="Ford Logo" style={{ width: "200px" }} />
        <img src={Ford} alt="Ford Logo" style={{ width: "100px" }} />
        <img src={Chevrolet} alt="Chevrolet Logo" style={{ width: "100px" }} />
        <img src={Honda} alt="Chevrolet Logo" style={{ width: "100px" }} />
        <img src={BMW} alt="Chevrolet Logo" style={{ width: "100px" }} />

      </div>

    </footer>
  );
};

export default Footer;
