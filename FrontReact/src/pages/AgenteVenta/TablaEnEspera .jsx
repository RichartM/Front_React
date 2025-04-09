import React from "react";
import { Table, Button } from "react-bootstrap";
import styled from "styled-components";
import { BiSolidUserVoice } from "react-icons/bi";

const StyledTable = styled(Table)`
  th {
    background-color: #018180;
    color: white;
    font-weight: bold;
    text-align: center;
  }

  td {
    text-align: center;
    vertical-align: middle;
  }

  tr:hover {
    background-color: #f1fdfd;
  }

  .btn-atender {
    background-color: #018180;
    color: white;
    border: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
  }

  .btn-atender:hover {
    background-color: #026c6c;
  }

  .btn-wrapper {
    display: flex;
    justify-content: center;
  }
`;

const TablaEnEspera = ({ autos = [], onAprobar }) => {
  console.log("Insaniiiiisimos",autos)
  console.log("..................................................................................")
  return (
    <StyledTable striped  hover responsive>
      <thead>
        <tr>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Matricula</th>
          <th>Correo</th>
          <th>Precio (MXN)</th>
          
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {autos.map((auto, i) => (
          <tr key={i}>
            <td>{auto.vehiculo.modelo}</td>
            <td>{auto.vehiculo.marca.nombre}</td>
            <td>{auto.cliente.name+" "+auto.cliente.lastname}</td>
            
            <td>{auto.cliente.email}</td>
            <td>${auto.vehiculo.precio?.toLocaleString()}</td>
            <td>
              <div className="btn-wrapper">
                <Button className="btn-atender" onClick={() => onAprobar(auto.id)}>
                  <BiSolidUserVoice size={16} />
                  Atender
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TablaEnEspera;
