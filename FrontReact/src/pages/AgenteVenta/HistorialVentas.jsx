import React, { useState, useEffect } from 'react';
import TablaHistorial from './TablaHistorial ';
import TablaEnEspera from './TablaEnEspera ';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FiltroBuscador from '../../components/FILTROS/FiltroBuscador'
import axios from 'axios'

export default function HistorialVentas() {
    const [activeTab, setActiveTab] = useState('historial');
    const [historialVentas, setHistorialVentas] = useState(null);
    const [agentes, setAgentes] = useState([]);
    const [correoAgente, setCorreoAgente] = useState(null);
    const [agenteAgregadoAhorita, setAgenteAgregadoAhorita] = useState(null);
    const [enEsperaFake, setEnEsperaFake] = useState([]); // Placeholder temporal

    const ventasHistorial = async () => {
        const token = localStorage.getItem("token");
        console.log("consultando el historial")
        if (token /*&& agenteAgregadoAhorita*/) {
            try {
                const response = await axios.get(`http://localhost:8080/ventas/${agenteAgregadoAhorita.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistorialVentas(response.data);
                console.log("informacion reelevante del server ",response.data)
            } catch (error) {
                console.error("Error al obtener historial de ventas:", error);
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

    useEffect(() => {
        fetchAgentes();
    }, []);

    useEffect(() => {
        if (agentes.length > 0 && correoAgente) {
            const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
            if (agenteEncontrado) {
                setAgenteAgregadoAhorita(agenteEncontrado);
                console.log("Ya cambio agente agregadoa ahirita");

            } else {
                console.log("No se encontró el agente con ese correo");
            }
        }
    }, [agentes, correoAgente]);

    useEffect(() => {
        if (agenteAgregadoAhorita) {
            ventasHistorial();
        }
    }, [agenteAgregadoAhorita]);

    const handleAprobar = (autoId) => {
        console.log("Aprobar auto con ID:", autoId);
        // lógica para aprobar
    };

    const handleEliminar = (autoId) => {
        console.log("Eliminar auto con ID:", autoId);
        // lógica para eliminar
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
                            Historial Insano
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
                    </div>
                </Col>
            </Row>


            <Card>
                <FiltroBuscador />
                <Card.Body>
                    <Row className="mb-2">
                        <Col>
                            <div
                                style={{
                                    borderBottom: 'var(--bs-nav-tabs-border-width, 1px) solid #dee2e6',
                                }}
                            ></div>
                        </Col>
                    </Row>

                    {activeTab === 'historial' && (
                        <TablaHistorial historial={historialVentas} />
                    )}
                    {activeTab === 'espera' && (
                        <TablaEnEspera autos={enEsperaFake} onAprobar={handleAprobar} onEliminar={handleEliminar} />
                    )}
                </Card.Body>
            </Card>
        </Container>

    );
}
