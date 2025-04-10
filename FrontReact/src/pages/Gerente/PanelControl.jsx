import React from 'react'
import { Form, Placeholder, Container, Row, Col, Card, Table, Modal, Button, Nav } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import CardAutosEspera from './CardsInformativos/CardAutosEspera'
import CardAutosDisponibles from './CardsInformativos/CardAutosDiponibles'
import CardAutosVendidos from './CardsInformativos/CardAutosVendidos'
import CardTotalAutos from './CardsInformativos/CardTotalAutos'
import BootstrapPagination from '../../components/common/BootstrapPagination';

import { useState, useEffect } from 'react';
import axios from "axios"

const CustomTableHeader = styled.thead`
  background-color: #018180;
  color: white;
  th {
    background-color: #018180;
    color: white;
    text-align: center;
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

  // Estados principales
  const [modelosReales, setModelosREales] = useState([]);
  const [autosVendidos, setAutosVendidos] = useState([]);
  const [autosCombinados, setAutosCombinados] = useState([]);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialVentas, setHistorialVentas] = useState([]);
  const [ventasCarros, setVentasCarros] = useState([]);

  // Estados de búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAutos, setFilteredAutos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados específicos para el historial
  const [historialSearchTerm, setHistorialSearchTerm] = useState("");
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [historialCurrentPage, setHistorialCurrentPage] = useState(1);
  const historialItemsPerPage = 5;


  // Función de búsqueda para el historial
  const handleHistorialSearch = (term) => {
    setHistorialSearchTerm(term);
    setHistorialCurrentPage(1); // Resetear a la primera página al buscar
    
    if (!term.trim()) {
      setFilteredHistorial([]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = ventasCarros.filter((venta) => {
      return (
        venta.vehiculo?.modelo?.toLowerCase().includes(lowerTerm) ||
        venta.vehiculo?.marca?.nombre?.toLowerCase().includes(lowerTerm) ||
        venta.cliente?.name?.toLowerCase().includes(lowerTerm) ||
        venta.cliente?.lastname?.toLowerCase().includes(lowerTerm) ||
        venta.agente?.name?.toLowerCase().includes(lowerTerm) ||
        venta.date?.toLowerCase().includes(lowerTerm) ||
        venta.vehiculo?.precio?.toString().includes(term)
      );
    });
    
    setFilteredHistorial(filtered);
  };

  // Combina los autos cuando se actualizan los modelos o autos vendidos
  useEffect(() => {
    setAutosCombinados([...modelosReales, ...autosVendidos]);
  }, [modelosReales, autosVendidos]);

  // Obtener datos iniciales
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Obtener autos disponibles y en espera
      axios.get('https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/estados?estados=Disponible&estados=En espera', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setModelosREales(response.data))
        .catch(error => console.error('Error al obtener modelos:', error));

      // Obtener autos vendidos
      buscarAutosVendidos();

      // Obtener historial de ventas
      buscarTodasLasVentas();
    }
  }, []);

  // Función de búsqueda mejorada
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Siempre volver a la página 1 al buscar

    if (!term.trim()) {
      setFilteredAutos([]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = autosCombinados.filter((auto) => {
      return (
        auto.modelo?.toLowerCase().includes(lowerTerm) ||
        auto.marca?.nombre?.toLowerCase().includes(lowerTerm) ||
        auto.matricula?.toLowerCase().includes(lowerTerm) ||
        auto.precio?.toString().includes(term) ||
        auto.year?.toString().includes(term) ||
        auto.color?.toLowerCase().includes(lowerTerm)
      );
    });

    setFilteredAutos(filtered);
  };


  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      axios.get(' https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/estados?estados=Disponible&estados=En espera', {
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


  //Aqui solo los simule
  const obtenerHistorialVentas = async () => {
    const ventasDummy = [
      {
        vehiculo: { modelo: "Civic", marca: { nombre: "Honda" } },
        cliente: { name: "Juan Pérez" },
        agente: { name: "Carlos Mendoza" },
        date: "2024-04-01",
        precioFinal: 275000,
      },
      {
        vehiculo: { modelo: "Corolla", marca: { nombre: "Toyota" } },
        cliente: { name: "Laura Sánchez" },
        agente: { name: "Ana Torres" },
        date: "2024-04-03",
        precioFinal: 290000,
      },
    ];

    setHistorialVentas(ventasDummy);
    setShowHistorialModal(true);
  };

  // Función de búsqueda mejorada


  const buscarAutosVendidos = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(" https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/estados?estados=Vendido", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("respuesta de carros vendidos: ", response.data)
        setAutosVendidos(response.data);
        return response.data

      } catch (error) {
        console.error("Error al obtener clientes:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      console.log("No se encontró el token");
      //setLoading(false);
    }
  };






  const buscarTodasLasVentas = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(" https://bwubka276h.execute-api.us-east-1.amazonaws.com/ventas/obtenerTodas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("respuesta del api con los autos vendidos: ", response.data)
        setVentasCarros(response.data);
        return response.data

      } catch (error) {
        console.error("Error al obtener clientes:", error);
      } finally {
        //setLoading(false);
      }
    } else {
      console.log("No se encontró el token");
      //setLoading(false);
    }
  };


  useEffect(() => {
    buscarAutosVendidos();
    buscarTodasLasVentas();
  }, []);



  //setAutosVendEspe(autosVendidos)

  // Datos a mostrar (filtrados o todos)
  const autosAMostrar = searchTerm ? filteredAutos : autosCombinados;

  // Cálculo de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAutos = autosAMostrar.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(autosAMostrar.length / itemsPerPage);
  ///////////////////////////////////////////////////////////////
  // Datos a mostrar en el historial (filtrados o todos)
  const historialAMostrar = historialSearchTerm ? filteredHistorial : ventasCarros;

  // Cálculo de paginación para el historial
  const historialLastItem = historialCurrentPage * historialItemsPerPage;
  const historialFirstItem = historialLastItem - historialItemsPerPage;
  const currentHistorial = historialAMostrar.slice(historialFirstItem, historialLastItem);
  const totalHistorialPages = Math.ceil(historialAMostrar.length / historialItemsPerPage);
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
        <div className="d-flex justify-content-between align-items-center mb-3 px-3">
          <div
            style={{
              color: '#018180',
              fontSize: '1.4rem',
              fontWeight: 'bold',
            }}
          >
            AUTOS VENDIDOS Y EN ESPERA
          </div>
          <CustomButton onClick={obtenerHistorialVentas}>
            Ver histórico de ventas
          </CustomButton>
        </div>


        <Card>
          <Row className="mb-3">
            <Col className="d-flex justify-content-start">
              <FiltroBuscador
                onSearch={handleSearch}
                placeholder="Buscar..."
              />
            </Col>
          </Row>
          <Row className="mb-1">

          </Row>





          <StyledWrapper>
            <div className="scrollable-table">
              <Table striped hover className="mt-2">
                <CustomTableHeader>
                  <tr>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Placa</th>
                    <th>Precio (MXN)</th>
                    <th>Año</th>
                    <th>Color</th>
                    <th>Estado <i className="bi bi-question-circle"></i></th>
                  </tr>
                </CustomTableHeader>

                <tbody>
                  {currentAutos.length > 0 ? (
                    currentAutos.map((auto, index) => (
                      <tr key={index}>
                        <td>{auto.modelo}</td>
                        <td>{auto.marca?.nombre}</td>
                        <td>{auto.matricula}</td>
                        <td>${auto.precio?.toLocaleString()}</td>
                        <td>{auto.year}</td>
                        <td>{auto.color}</td>
                        <td>{auto.estado?.nombre}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        {searchTerm ? "No se encontraron resultados" : "No hay datos disponibles"}
                      </td>
                    </tr>
                  )}
                </tbody>

              </Table>

            </div>
          </StyledWrapper>
          {/* Paginación */}
          <BootstrapPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}  // ← Usa setCurrentPage directamente
          />
        </Card>

        <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} size="lg" centered>
        <StyledWrapper>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#018180", fontWeight: "bold" }}>
              Historial de Ventas
            </Modal.Title>
          </Modal.Header>
          
          {/* Buscador del historial */}
          <p></p>
          <div style={{ padding: '0 20px' , top: '10px'}}>
            <FiltroBuscador
              onSearch={handleHistorialSearch}
              placeholder="Buscar en historial..."
            />
          </div>
          
          <Modal.Body>
            <div className="scrollable-table">
              <Table striped hover>
                <CustomTableHeader>
                  <tr>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Cliente</th>
                    <th>Vendedor</th>
                    <th>Fecha</th>
                    <th>Precio (MXN)</th>
                  </tr>
                </CustomTableHeader>
                <tbody>
                  {currentHistorial.length > 0 ? (
                    currentHistorial.map((venta, i) => (
                      <tr key={i}>
                        <td>{venta.vehiculo?.modelo}</td>
                        <td>{venta.vehiculo?.marca?.nombre}</td>
                        <td>{venta.cliente?.name} {venta.cliente?.lastname}</td>
                        <td>{venta.agente?.name} {venta.agente?.lastname} {venta.agente?.surname}</td>
                        <td>{venta.date}</td>
                        <td>${venta.vehiculo?.precio?.toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {historialSearchTerm ? "No se encontraron resultados" : "No hay datos disponibles"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          
          {/* Paginación del historial */}
          {totalHistorialPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
              <BootstrapPagination
                currentPage={historialCurrentPage}
                totalPages={totalHistorialPages}
                onPageChange={setHistorialCurrentPage}
              />
            </div>
          )}
          
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowHistorialModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </StyledWrapper>
      </Modal>

      </Container>
    </>
  )
}
