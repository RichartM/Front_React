import React from 'react'
import { Form, Placeholder, Container, Row, Col, Card, Table, Modal, Button, Nav } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import CardAutosEspera from './CardsInformativos/CardAutosEspera'
import CardAutosDisponibles from './CardsInformativos/CardAutosDiponibles'
import CardAutosVendidos from './CardsInformativos/CardAutosVendidos'
import CardTotalAutos from './CardsInformativos/CardTotalAutos'
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

  ///OBTENIENDO LOS MODELOS DE LA BASE DE DARTO
  const [modelosReales, setModelosREales] = useState([])
  const [autosVendidos, setAutosVendidos] = useState([])
  const [autosVendEspe, setAutosVendEspe] = useState([])
  const a = []
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialVentas, setHistorialVentas] = useState([]);
  const [ventasCarros,setVentasCarros] = useState([]);

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

  /*
  USA ESTE PARA REMPLAZAR EL ENPOINT TOMI
  const obtenerHistorialVentas = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get("http://localhost:8080/ventas/todas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Ventas:", response.data);
        setHistorialVentas(response.data);
        setShowHistorialModal(true);
      } catch (error) {
        console.error("Error al obtener el historial de ventas:", error);
      }
    }
  };
  */

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
  


  const buscarAutosVendidos = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(" http://localhost:8080/vehiculo/estados?estados=Vendido", {
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
        const response = await axios.get(" http://localhost:8080/ventas/obtenerTodas", {
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

  a.push(...modelosReales)
  a.push(...autosVendidos)

  console.log("data de los autos: ", a)
  //setAutosVendEspe(autosVendidos)
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
              <FiltroBuscador placeholder="Buscar..." />

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
                  {a.map((marca, index) => (
                    <tr key={index}>
                      <td>{marca.modelo}</td>
                      <td>{marca.marca?.nombre}</td>
                      <td>{marca.matricula}</td>
                      <td>{marca.precio}</td>
                      <td>{marca.year}</td>
                      <td>{marca.color}</td>
                      <td> {marca.estado?.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

            </div>
          </StyledWrapper>
        </Card>
        <Modal show={showHistorialModal} onHide={() => setShowHistorialModal(false)} size="lg" centered>
          <StyledWrapper>
            <Modal.Header closeButton>
              <Modal.Title style={{ color: "#018180", fontWeight: "bold" }}>
                Historial de Ventas
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="scrollable-table">
                <Table striped  hover>
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
                    {ventasCarros.map((venta, i) => (
                      <tr key={i}>
                        <td>{venta.vehiculo?.modelo}</td>
                        <td>{venta.vehiculo?.marca?.nombre}</td>
                        <td>{venta.cliente?.name+" "+venta.cliente?.lastname}</td>
                        <td>{venta.agente?.name+" "+venta.agente?.lastname+" "+venta.agente.surname}</td>
                        <td>{venta.date}</td>
                        <td>${venta.vehiculo.precio.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Modal.Body>
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
