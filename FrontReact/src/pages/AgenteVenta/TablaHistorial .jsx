import React from "react";
import { Table, Button } from "react-bootstrap";
import styled from "styled-components";
import { FaEye } from "react-icons/fa6";

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

  .btn-ver {
    background-color: #018180;
    color: white;
    border: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 12px;
    margin: 0 auto;
  }

  .btn-ver:hover {
    background-color: #026c6c;
  }
`;

const TablaHistorial = ({ historial = [] }) => {
  return (
    <StyledTable striped bordered hover responsive>
      <thead>
        <tr>
          <th>Modelo</th>
          <th>Marca</th>
          <th>Cliente</th>
          <th>Precio (MXN)</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {historial.map((auto, i) => (
          <tr key={i}>
            <td>{auto.modelo}</td>
            <td>{auto.marca}</td>
            <td>{auto.cliente}</td>
            <td>${auto.precioVenta.toLocaleString()}</td>
            <td>{auto.fechaVenta}</td>
            <td>
              <Button className="btn-ver">
                <FaEye />
                Ver detalles
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TablaHistorial;
