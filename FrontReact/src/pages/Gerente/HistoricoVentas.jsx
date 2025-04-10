import React, { useState, useEffect } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import axios from 'axios'

const HistoricoVentas = ({ show, onHide, agente }) => {
  // Datos de ejemplo para el historial de ventas
  console.log("prueba para ver si se muestran el id agente: "+agente.id)
  const [historialVentas,setHistorialVentas] = useState([])


  const ventasHistorial = async () => {
    const token = localStorage.getItem("token");
    console.log("consultando el historial")
    if (token /*&& agenteAgregadoAhorita*/) {
        try {
            const response = await axios.get(`https://bwubka276h.execute-api.us-east-1.amazonaws.com/ventas/porAgente/${agente.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistorialVentas(response.data);
            console.log("informacion reelevante del server para el modal emergente",response.data)
        } catch (error) {
            console.error("Error al obtener historial de ventas:", error);
        }
    }
};

 useEffect(() => {
    ventasHistorial();
  }, []);


  const [historicoVentas, setHistoricoVentas] = useState([
    {
      id: 1,
      modelo: "Model S",
      marca: "Tesla",
      cliente: "Juan Pérez",
      fecha: "2023-10-01",
      precio: "$75,000",
      extra: "Pago en efectivo",
    },
    {
      id: 2,
      modelo: "Corolla",
      marca: "Toyota",
      cliente: "María López",
      fecha: "2023-09-15",
      precio: "$25,000",
      extra: "Financiado",
    },
    {
      id: 3,
      modelo: "Mustang",
      marca: "Ford",
      cliente: "Carlos Sánchez",
      fecha: "2023-08-20",
      precio: "$45,000",
      extra: "Leasing",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Filtrar los datos basados en el término de búsqueda
  const filteredVentas = historicoVentas.filter((venta) =>
    venta.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.precio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venta.extra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Histórico de Ventas - {agente?.name}</Modal.Title>
      </Modal.Header>
      <p></p>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px", marginRight: "20px"}}>
        <FiltroBuscador onSearch={handleSearch} placeholder="Buscar ventas..." />
      </div>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Cliente</th>
              <th>Fecha de Venta</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {historialVentas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.vehiculo.modelo}</td>
                <td>{venta.vehiculo.marca.nombre}</td>
                <td>{venta.cliente.nomre+" "+venta.cliente.lastname}</td>
                <td>{venta.date}</td>
                <td>{venta.vehiculo.precio}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HistoricoVentas;