import React from 'react'
import { Form, Placeholder, Container, Row, Col, Card, Table, Modal, Button, Nav } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import CardAutosEspera from './CardsInformativos/CardAutosEspera'
import CardAutosDisponibles from './CardsInformativos/CardAutosDiponibles'
import CardAutosVendidos from './CardsInformativos/CardAutosVendidos'
import CardTotalAutos from './CardsInformativos/CardTotalAutos'
import { useState,useEffect } from 'react';
import axios from "axios"

const CustomTableHeader = styled.thead`
  background-color: #018180;
  color: white;
  th {
    background-color: #018180;
    color: white;
    padding: 12px;
    text-align: center;
    border: 1px solid rgb(255, 255, 255);
  }
`;

const CustomButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  color: white !important;
  &:hover {
    background-color: #026c6c !important;
  }
`;


const GlobalStyle = createGlobalStyle`

    /*   body {
    overflow: hidden;🔒 Bloquea la barra de desplazamiento del navegador */
  
  .swal2-popup {
    background-color: rgb(255, 255, 255);
    color: black;
    border-radius: 10px;
  }
  .btn-swal-confirmar {
    background-color: #018180;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-swal-confirmar:hover {
    background-color: rgb(5, 110, 110);
  }
  .btn-swal-cancelar {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-swal-cancelar:hover {
    background-color: #c82333;
  }
`;

const StyledWrapper = styled.div`

  .scrollable-table {
    max-height: 400px;
    overflow-y: auto; /* ✅ Mantiene el scroll solo en la tabla */
    scrollbar-width: thin;
    scrollbar-color: #018180 #f1f1f1;
  }

  .scrollable-table::-webkit-scrollbar {
    width: 8px;
  }

  .scrollable-table::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 4px;
  }

  .scrollable-table::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }
  .title {
    font-size: 28px;
    color: rgb(55, 159, 152);
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: rgb(55, 159, 152);
  }
  .title::before {
    width: 18px;
    height: 18px;
    background-color: rgb(55, 159, 152);
  }
  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }
  .submit {
    border: none;
    outline: none;
    background-color: #018180;
    padding: 10px;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    transition: 0.3s ease;
  }
  .submit:hover {
    background-color: #026c6c;
    color: white;
  }
  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default function PanelControl() {

    ///OBTENIENDO LOS MODELOS DE LA BASE DE DARTO
    const [modelosReales, setModelosREales] = useState([])
  
    useEffect(() => {
      const token = localStorage.getItem('token'); // Obtener el token del localStorage
      if (token) {
        axios.get(' http://localhost:8080/vehiculo/estados?estados=Disponible&estados=En espera', {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el header
          },
        })
          .then(response => {
            setModelosREales(response.data);
          })
          .catch(error => {
            console.error('Error al obtener los modelos:', error);
          });
      }
    }, []);

  return (
      <>
                <GlobalStyle />
                <Container>

                <div className="cards-wrapper">
    <CardAutosEspera />
    <CardAutosDisponibles />
    <CardAutosVendidos />
    <CardTotalAutos />
</div>


                <p></p>
                    <Card>
                        <Row className="mb-3">
                            <Col className="d-flex justify-content-end">
                                <FiltroBuscador  placeholder="Buscar..." />
    
                            </Col>
                        </Row>
                        <Row className="mb-1">
                            <Col>
                                <Nav variant="tabs" defaultActiveKey="/">
                                    <Nav.Item>
                                        <Nav.Link eventKey="/"
                                            style={{
                                                backgroundColor: '#018180',
                                                border: '1px solidrgb(89, 104, 104)',
                                                borderRadius: '5px',
                                                boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)',
                                            }}
                                        >AUTOS VENDIDOS Y EN ESPERA</Nav.Link>
                                    </Nav.Item>
                                    
    
                                </Nav>
                            </Col>
                        </Row>
    
    
    

    
                        <StyledWrapper>
                            <div className="scrollable-table">
                            <Table striped bordered hover className="mt-2">
                                  <CustomTableHeader>
                                      <tr>
                                          <th>Modelo</th>
                                          <th>Marca</th>
                                          <th>Placa</th>
                                          <th>Precio (MXN)</th>
                                          <th>Año</th>
                                          <th>Color</th>
                                          <th>Estado</th>
                                      </tr>
                                  </CustomTableHeader>

                                  <tbody>
                                      {modelosReales.map((marca, index) => (
                                          <tr key={index}>
                                              <td>{marca.modelo}</td>
                                              <td>{marca.marca.nombre}</td>
                                              <td>{marca.matricula}</td>
                                              <td>{marca.precio}</td>
                                              <td>{marca.year}</td>
                                              <td>{marca.color}</td>
                                              <td><i className="bi bi-question-circle"></i> {marca.estado.nombre}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </Table>

                            </div>
                        </StyledWrapper>
                    </Card>
                </Container>
            </>
  )
}
