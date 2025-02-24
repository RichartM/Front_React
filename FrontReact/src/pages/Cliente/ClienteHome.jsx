import React from "react";
import NavCliente from "./NavCliente";

const ClienteHome = () => {
  return (
    <>
      <NavCliente />
      <div className="container mt-5">
        <h2>Bienvenido a la sección de Clientes</h2>
        <p>Explora nuestras marcas y servicios disponibles.</p>
      </div>
    </>
  );
};

export default ClienteHome;
