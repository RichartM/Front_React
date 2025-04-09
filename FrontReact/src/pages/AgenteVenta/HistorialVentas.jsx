import React, { useState, useEffect } from 'react';
import TablaHistorial from './TablaHistorial ';
import TablaEnEspera from './TablaEnEspera ';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import styled from 'styled-components';
import ClientesNuevos from './ClientesNuevos';

import axios from 'axios';
const CardContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #018180 #f1f1f1;
  padding-right: 10px;
  position: relative;

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

export default function HistorialVentas() {
  const [activeTab, setActiveTab] = useState('historial');
  const [historialVentas, setHistorialVentas] = useState([]);
  const [autosEnEspera, setAutosEnEspera] = useState([]);
  const [agentes, setAgentes] = useState([]);
  const [correoAgente, setCorreoAgente] = useState(null);
  const [agenteAgregadoAhorita, setAgenteAgregadoAhorita] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHistorial, setFilteredHistorial] = useState([]);
  const [searchTermEspera, setSearchTermEspera] = useState("");
  const [filteredEspera, setFilteredEspera] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const datosAMostrar = searchTerm ? filteredHistorial : historialVentas;
  const autosAMostrar = searchTermEspera ? filteredEspera : autosEnEspera;

  const datosVisibles = datosAMostrar.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const esperaVisible = autosAMostrar.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (activeTab === 'historial' ? datosAMostrar.length : autosAMostrar.length) / itemsPerPage
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (!term.trim()) return setFilteredHistorial([]);
    const lowerTerm = term.toLowerCase();
    const filtered = historialVentas.filter((venta) => (
      venta.vehiculo?.modelo?.toLowerCase().includes(lowerTerm) ||
      venta.vehiculo?.marca?.nombre?.toLowerCase().includes(lowerTerm) ||
      venta.cliente?.name?.toLowerCase().includes(lowerTerm) ||
      venta.cliente?.lastname?.toLowerCase().includes(lowerTerm) ||
      venta.date?.toLowerCase().includes(lowerTerm) ||
      venta.vehiculo?.precio?.toString().includes(term)
    ));
    setFilteredHistorial(filtered);
  };

  const handleSearchEspera = (term) => {
    setSearchTermEspera(term);
    setCurrentPage(1);
    if (!term.trim()) return setFilteredEspera([]);
    const lowerTerm = term.toLowerCase();
    const filtered = autosEnEspera.filter((auto) => (
      auto.vehiculo?.modelo?.toLowerCase().includes(lowerTerm) ||
      auto.vehiculo?.marca?.nombre?.toLowerCase().includes(lowerTerm) ||
      auto.cliente?.name?.toLowerCase().includes(lowerTerm) ||
      auto.cliente?.lastname?.toLowerCase().includes(lowerTerm) ||
      auto.cliente?.email?.toLowerCase().includes(lowerTerm)
    ));
    setFilteredEspera(filtered);
  };

  const ventasHistorial = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:8080/ventas/porAgente/${agenteAgregadoAhorita.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistorialVentas(response.data);
      } catch (error) {
        console.error("Error al obtener historial de ventas:", error);
      }
    }
  };

  const buscarAutosEnEspera = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(
          `http://localhost:8080/ventas/agenteAndEstado/${agenteAgregadoAhorita.id}/En espera`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAutosEnEspera(response.data);
      } catch (error) {
        console.error("Error al obtener autos en espera:", error);
      }
    }
  };

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

  useEffect(() => {
    const fetchAgentes = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:8080/api/auth/fullAgentes", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAgentes(response.data);
        } catch (error) {
          console.error("Error al obtener agentes:", error);
        }
      }
    };
    fetchAgentes();
  }, []);

  useEffect(() => {
    if (agentes.length > 0 && correoAgente) {
      const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
      if (agenteEncontrado) {
        setAgenteAgregadoAhorita(agenteEncontrado);
      }
    }
  }, [agentes, correoAgente]);

  useEffect(() => {
    if (agenteAgregadoAhorita) {
      ventasHistorial();
      buscarAutosEnEspera();
    }
  }, [agenteAgregadoAhorita]);


  const handleAprobar = (autoId) => {
    console.log("Aprobar auto con ID:", autoId);
  };

  const handleEliminar = (autoId) => {
    console.log("Eliminar auto con ID:", autoId);
  };

  return (
    <Container style={{ marginTop: "100px", marginBottom: "40px" }}>
      <Row className="mb-4">
        <Col>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div
              onClick={() => setActiveTab('historial')}
              style={{
                color: '#018180',
                padding: '12px 25px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'historial' ? '#d0f0f0' : 'transparent',
                borderRadius: '5px',
              }}
            >
              Historial
            </div>
            <div
              onClick={() => setActiveTab('espera')}
              style={{
                color: '#018180',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'espera' ? '#d0f0f0' : 'transparent',
                borderRadius: '5px',
              }}
            >
              Autos en espera
            </div>
            <div
              onClick={() => setActiveTab('newCli')}
              style={{
                color: '#018180',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: activeTab === 'newCli' ? '#d0f0f0' : 'transparent',
                borderRadius: '5px',
              }}
            >
              Clientes Nuevos
            </div>
          </div>
        </Col>
      </Row>

      <Card>
        <Row className="mt-3 mb-3">
          <Col style={{ marginLeft: '2%' }}>
            {activeTab === 'historial' && (
              <FiltroBuscador onSearch={handleSearch} placeholder="Buscar en historial..." />
            )}
            {activeTab === 'espera' && (
              <FiltroBuscador onSearch={handleSearchEspera} placeholder="Buscar en autos en espera..." />
            )}
            {activeTab === 'newCli' && (
              <FiltroBuscador onSearch={handleSearchEspera} placeholder="Buscar en autos en espera..." />
            )}
          </Col>
        </Row>

        <Card.Body>
          <CardContainer>
            {activeTab === 'historial' && (
              <TablaHistorial historial={datosVisibles} />
            )}

            {activeTab === 'espera' && (
              <TablaEnEspera autos={esperaVisible} onAprobar={handleAprobar} onEliminar={handleEliminar} />
            )}

            {activeTab === 'newCli' && (
              <ClientesNuevos autos={esperaVisible} onAprobar={handleAprobar} onEliminar={handleEliminar} />
            )}
          </CardContainer>
          <BootstrapPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        </Card.Body>

        
      </Card>
    </Container>
  );
}
