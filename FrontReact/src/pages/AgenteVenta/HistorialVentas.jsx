import React, { useState } from 'react';
import TablaHistorial from './TablaHistorial ';
import TablaEnEspera from './TablaEnEspera ';
import { Container, Row, Col, Card } from 'react-bootstrap';
import FiltroBuscador from '../../components/FILTROS/FiltroBuscador'

// Datos simulados de ejemplo (puedes reemplazarlos por datos reales desde una API)
const historialFake = [
    {
      modelo: 'Sedan-X1',
      marca: 'Toyota',
      cliente: 'Carlos Pérez',
      precioVenta: 350000,
      fechaVenta: '2024-12-01',
    },
    {
      modelo: 'SUV-A2',
      marca: 'Ford',
      cliente: 'Ana Gómez',
      precioVenta: 450000,
      fechaVenta: '2025-01-10',
    },
  ];
  

  const enEsperaFake = [
    {
      id: 1,
      modelo: "Aveo Sedán",
      marca: "Chevrolet",
      placa: "XYZ-123",
      precio: 280000,
      color: "Blanco",
      descripcion: "Compacto de ciudad",
      correo: "juanPerez@gmail.com"
    },
    {
      id: 2,
      modelo: "Versa",
      marca: "Nissan",
      placa: "ABC-456",
      precio: 310000,
      color: "Gris",
      descripcion: "Económico y eficiente",
      correo: "juanPerez@gmail.com"
    }
  ];
  

export default function HistorialVentas() {
    const [activeTab, setActiveTab] = useState('historial');

    const handleAprobar = (id) => {
        console.log("Aprobando auto con ID:", id);
        // Aquí va la lógica para aprobar (actualizar estado en base de datos)
    };

    const handleEliminar = (id) => {
        console.log("Eliminando auto con ID:", id);
        // Aquí va la lógica para eliminar (petición DELETE o similar)
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
                        <TablaHistorial historial={historialFake} />
                    )}
                    {activeTab === 'espera' && (
                        <TablaEnEspera autos={enEsperaFake} onAprobar={handleAprobar} onEliminar={handleEliminar} />
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}
