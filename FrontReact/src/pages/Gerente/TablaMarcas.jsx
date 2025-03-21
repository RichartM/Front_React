import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import BootstrapPagination from '../../components/common/BootstrapPagination';

const CardContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #018180 #f1f1f1;
  padding-right: 10px;
  position: relative; /* Asegura que el contenedor esté posicionado correctamente */
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
`;

const CustomCard = styled(Card)`
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  margin-bottom: 2%;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: 140px; /* Altura fija */
  min-height: 140px; /* Altura mínima */
  overflow: hidden;
  padding: 5px;

  &.custom-card {
    min-height: 140px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TablaMarcas = ({
  marcas,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  recordsPerPage,
  onEdit,
  onToggleStatus,
}) => {
  const filteredMarcas = marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentMarcas = filteredMarcas.slice(
    (currentPage - 1) * recordsPerPage ,
    currentPage * recordsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-end mb-2">
        {/* Aquí puedes dejar espacio para botones si en el futuro agregas */}
      </div>
      
      <CardContainer>
        <Row>
          {currentMarcas.map((marca) => (
            <Col md={3} lg={3} key={marca.id}> {/* 4 tarjetas por fila */}
              <CustomCard className="custom-card">
                <Card.Body>
                  <Card.Title style={{ color: '#018180', fontWeight: 'bold', fontSize: '20px' }}>
                    {marca.nombre}
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '17px' }}>
                    Estado: {marca.estado ? "Activo" : "Inactivo"}
                  </Card.Subtitle>
                  <div className="d-flex justify-content-between">
                    <BsPencilSquare
                      className="text-primary fs-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => onEdit(marca, true)}
                    />
                    {marca.estado ? (
                      <BsToggleOn
                        className="text-success fs-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => onToggleStatus(marca, !marca.estado)}
                      />
                    ) : (
                      <BsToggleOff
                        className="text-danger fs-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => onToggleStatus(marca, !marca.estado)}
                      />
                    )}
                  </div>
                </Card.Body>
              </CustomCard>
            </Col>
          ))}
        </Row>
      </CardContainer>

      <BootstrapPagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredMarcas.length / recordsPerPage)}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default TablaMarcas;