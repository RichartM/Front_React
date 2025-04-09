import React, { useState, useEffect } from "react";
import NavCliente from "./NavCliente";
import { Container, Card, Table, Modal, Button } from "react-bootstrap";
import styled, { createGlobalStyle } from "styled-components";
import AgregarServicios from "./AgregarServicios";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GrHostMaintenance } from "react-icons/gr";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import axios from 'axios';

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
  const [filteredVentas, setFilteredVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const [userId, setUserId] = useState("");
  const [correo, setCorreoAgente] = useState("");
  const [historialVentas, setHistorialVentas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        setCorreoAgente(payload.sub);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  const fetchClientes = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:8080/cliente/buscar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (correo && clientes.length > 0) {
      const cliente = clientes.find(cli => cli.email === correo);
      if (cliente) {
        setUserId(cliente.id);
      } else {
        console.warn("Cliente no encontrado con el correo:", correo);
      }
    }
  }, [correo, clientes]);

  const ventasHistorial = async () => {
    const token = localStorage.getItem("token");
    if (token && userId) {
      try {
        const response = await axios.get(`http://localhost:8080/ventas/porCliente/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistorialVentas(response.data);
      } catch (error) {
        console.error("Error al obtener historial de ventas:", error);
      }
    }
  };

  useEffect(() => {
    if (userId) ventasHistorial();
  }, [userId]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    const lowerTerm = term.toLowerCase();
    const filtered = historialVentas.filter((venta) => {
      const { modelo, marca, matricula, precio } = venta.vehiculo || {};
      const fecha = venta.date;
      return (
        modelo?.toLowerCase().includes(lowerTerm) ||
        marca?.nombre?.toLowerCase().includes(lowerTerm) ||
        matricula?.toLowerCase().includes(lowerTerm) ||
        precio?.toString().includes(lowerTerm) ||
        fecha?.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredVentas(filtered);
  };

  const ventasFiltradas = searchTerm ? filteredVentas : historialVentas;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVentas = ventasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);

  return (
    <>
      <GlobalStyle />
      <NavCliente />
      <Container className="mt-5">
        <div style={{ color: '#018180', padding: '12px 25px', fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Historial de Compras de tus Autos
        </div>
        <Card className="mb-4">
          <StyledWrapper>
            <div className="scrollable-table">
              <CustomTableHeader>
                <FiltroBuscador onSearch={handleSearch} placeholder="Buscar compra..." />
                <hr style={{ borderTop: '1px solid #ccc', margin: '10px 0' }} />
                <Table striped hover className="mt-2">
                  <thead>
                    <tr>
                      <th>Modelo</th>
                      <th>Marca</th>
                      <th>Placa</th>
                      <th>Precio (MXN)</th>
                      <th>Fecha</th>
                      <th>Cantidad de Servicios</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVentas.map((auto) => (
                      <tr key={auto.id}>
                        <td>{auto.vehiculo?.modelo || 'N/A'}</td>
                        <td>{auto.vehiculo?.marca?.nombre || 'N/A'}</td>
                        <td>{auto.vehiculo?.matricula || 'N/A'}</td>
                        <td>${auto.vehiculo?.precio?.toLocaleString() || '0'}</td>
                        <td>{auto.date || 'N/A'}</td>
                        <td>{auto.ventaServicios?.length || 0}</td>
                        <td>
                          <AiOutlineFileSearch size={35} style={{ marginRight: '10px', cursor: 'pointer' }} onClick={() => setShowDetalleModal(true) || setSelectedAuto(auto)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CustomTableHeader>
            </div>
          </StyledWrapper>
          <BootstrapPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
        </Card>
      </Container>

      <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg" centered>
        <StyledWrapper>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "#018180", fontWeight: "bold" }}>Detalles de la Compra</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAuto ? (
              <>
                <p><strong>Modelo:</strong> {selectedAuto.vehiculo?.modelo}</p>
                <p><strong>Marca:</strong> {selectedAuto.vehiculo?.marca?.nombre}</p>
                <p><strong>Matrícula:</strong> {selectedAuto.vehiculo?.matricula}</p>
                <p><strong>Precio:</strong> ${selectedAuto.price}</p>
                <p><strong>Fecha de Compra:</strong> {selectedAuto.date}</p>
                <hr />
                <h5 style={{ color: "#018180" }}>Servicios Contratados</h5>
                {selectedAuto.vehiculo?.ventaServicios?.length > 0 ? (
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Servicio</th>
                        <th>Descripción</th>
                        <th>Precio (MXN)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAuto.vehiculo.ventaServicios.map((serv, idx) => (
                        <tr key={idx}>
                          <td>{serv.nombre}</td>
                          <td>{serv.descripcion}</td>
                          <td>${serv.precio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No hay servicios contratados para este auto.</p>
                )}
              </>
            ) : (
              <p>No hay información disponible.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </StyledWrapper>
      </Modal>

      <Modal show={showServicioModal} onHide={() => setShowServicioModal(false)} centered>
        <AgregarServicios cerrarModal={() => setShowServicioModal(false)} />
      </Modal>
    </>
  );
};

export default ClienteHistorial;
