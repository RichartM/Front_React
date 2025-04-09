import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
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
  const [showModal, setShowModal] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  const handleVerDetalles = (auto) => {
    setDetalleSeleccionado(auto);
    setShowModal(true);
  };

  return (
    <>
      <StyledTable striped hover responsive>
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
          {historial?.map((auto, i) => (
            <tr key={i}>
              <td>{auto?.vehiculo.modelo}</td>
              <td>{auto?.vehiculo.marca.nombre}</td>
              <td>{auto?.cliente.name+" "+auto.cliente.lastname}</td>
              <td>${auto?.vehiculo.precio.toLocaleString()}</td>
              <td>{auto?.date}</td>
              <td>
                <Button className="btn-ver" onClick={() => handleVerDetalles(auto)}>
                  <FaEye />
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#018180", fontWeight: "bold" }}>
            Detalles del Vehículo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleSeleccionado ? (
            <div>
              <p><strong>Modelo:</strong> {detalleSeleccionado.vehiculo.modelo}</p>
              <p><strong>Marca:</strong> {detalleSeleccionado.vehiculo.marca.nombre}</p>
              <p><strong>Cliente:</strong> {detalleSeleccionado.cliente.name+" "+detalleSeleccionado.cliente.lastname}</p>
              <p><strong>Precio Final:</strong> ${detalleSeleccionado.vehiculo.precio.to}</p>
              <p><strong>Fecha:</strong> {detalleSeleccionado.date}</p>
              {/* Puedes añadir más campos si los tienes */}
            </div>
          ) : (
            <p>No hay datos disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TablaHistorial;
