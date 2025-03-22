import React, { useState } from "react";
import NavCliente from "./NavCliente";
import { Container, Card, Table, Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import AgregarServicios from "./AgregarServicios";

const GlobalStyle = createGlobalStyle`
  .table-header {
    background-color: #018180;
    color: white;
    text-align: center;
  }
  .table-header th {
    padding: 12px;
    border: 1px solid white;
    
  }

  @media (max-width: 768px) {
    .table-header th {
      padding: 1%;
    }
    .table-td {
      padding: 1%;
    }
  }
`;

const CustomTableHeader = styled.thead`
    th {
      background-color: #018180;
      color: white;
      text-align: center;
    }
  `;
 
const StyledWrapper = styled.div`
  .scrollable-table {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #018180 #f1f1f1;
  }

`;

const ClienteHistorial = () => {
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [showServicioModal, setShowServicioModal] = useState(false);

  const autos = [
    { id: 1, modelo: "Toyota Corolla", año: 2020, historial: [{ producto: "Cambio de Aceite", fecha: "2024-03-10", precio: "$50", estado: "Completado" }] },
    { id: 2, modelo: "Honda Civic", año: 2019, historial: [{ producto: "Cambio de Filtros", fecha: "2024-02-25", precio: "$30", estado: "Pendiente" }] },
    { id: 3, modelo: "Mazda 3", año: 2021, historial: [{ producto: "Balanceo", fecha: "2024-02-10", precio: "$40", estado: "Completado" }] },
  ];

  const handleVerDetalles = (auto) => {
    setSelectedAuto(auto);
    setShowDetalleModal(true);
  };

  const handleVerServicios = (auto) => {
    setSelectedAuto(auto);
    setShowServicioModal(true);
  };

  return (
    <>
      <GlobalStyle />
      <NavCliente />
      <Container className="mt-5">
      <div
          style={{
            color: '#018180',
            padding: '12px 25px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            display: 'inline-block',
            marginBottom: '20px',
          }}
        >
        Historial de Compras de tus Autos
        </div>
        <Card className="mb-4">
          <StyledWrapper>
            <div className="scrollable-table">
            <CustomTableHeader>

              <Table striped hover>
                <thead>
                  <tr>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Última Compra</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {autos.map((auto) => (
                    <tr key={auto.id}>
                      <td>{auto.modelo}</td>
                      <td>{auto.año}</td>
                      <td>{auto.historial.length > 0 ? auto.historial[0].producto : "Sin compras"}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => handleVerDetalles(auto)}>
                          Detalles
                        </Button>
                        <Button variant="success" size="sm" className="ms-2" onClick={() => handleVerServicios(auto)}>
                          Contratar Servicio
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
              </CustomTableHeader>

            </div>
          </StyledWrapper>
        </Card>
      </Container>

      {/* Modal para Detalles de Compra */}
      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAuto && selectedAuto.historial.length > 0 ? (
            <>
              <p><strong>Modelo:</strong> {selectedAuto.modelo}</p>
              <p><strong>Año:</strong> {selectedAuto.año}</p>
              <p><strong>Producto:</strong> {selectedAuto.historial[0].producto}</p>
              <p><strong>Fecha:</strong> {selectedAuto.historial[0].fecha}</p>
              <p><strong>Precio:</strong> {selectedAuto.historial[0].precio}</p>
              <p><strong>Estado:</strong> {selectedAuto.historial[0].estado}</p>
            </>
          ) : (
            <p>No hay detalles de compra disponibles.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para contratar servicio */}
      <Modal show={showServicioModal} onHide={() => setShowServicioModal(false)} centered>
        <AgregarServicios cerrarModal={() => setShowServicioModal(false)} />
      </Modal>
    </>
  );
};

export default ClienteHistorial;
