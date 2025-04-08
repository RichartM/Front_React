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
      <p>© 2025 SEGA. Todos los derechos reservados.</p>
      <p>Contacto: info@sega.com | Teléfono: +52  777 168 3807</p>
       {/* Contenedor de imágenes en una sola línea */}
       <div style={{ display: "flex", flexWrap:"wraps" ,gap: "20px", justifyContent: "center", marginBottom: "10px" }}>
       <img src={Mercedes} alt="Mercedes Logo" style={{ width: "200px" }} />
        <img src={Ford} alt="Ford Logo" style={{ width: "100px" }} />
        <img src={Chevrolet} alt="Chevrolet Logo" style={{ width: "100px" }} />
        <img src={Honda} alt="Honda Logo" style={{ width: "100px" }} />
        <img src={BMW} alt="BMW Logo" style={{ width: "100px" }} />

      </div>

    </footer>
  );
};

export default Footer;
