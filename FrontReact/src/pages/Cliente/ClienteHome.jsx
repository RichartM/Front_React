import React, { useState,useEffect } from "react";
import NavCliente from "./NavCliente";
import { Container, Card, Table, Modal, Button } from "react-bootstrap";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import AgregarServicios from "./AgregarServicios";
import { AiOutlineFileSearch } from "react-icons/ai";
import { GrHostMaintenance } from "react-icons/gr";
import axios from 'axios'



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



  const [userId, setUserId] = useState("")
  const [correo,setCorreoAgente] = useState("")
  const [historialVentas,setHistorialVentas] = useState([])
  const [clientes,setClientes] = useState([])

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
          console.log("dataaaaaInsalubre",response.data)
          //setFilteredClientes(response.data);

          return response.data; // ⬅️ Retornamos los datos actualizados

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
  fetchClientes();
    }, []);

    useEffect(() => {
      if (correo && clientes.length > 0) {
        const cliente = clientes.find(cli => cli.email === correo);
        if (cliente) {
          setUserId(cliente.id);
          console.log("idddddddddddddddddddddddddd: ",cliente.id)
        } else {
          console.warn("Cliente no encontrado con el correo:", correo);
        }
      }
    }, [correo, clientes]); // <- depende de ambos
    

    //setUserId(clientes.find(cli => cli.correo === correo));

    const ventasHistorial = async () => {
  const token = localStorage.getItem("token");
  console.log("consultando el historial")
  if (token /*&& agenteAgregadoAhorita*/) {
      try {
          const response = await axios.get(`http://localhost:8080/ventas/${userId}`, {
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
  if (userId) {
    ventasHistorial();
  }
}, [userId]);


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
          <th>Marca</th>
          <th>Placa</th>
          <th>Precio (MXN)</th>
          <th>Fecha</th>
          <th>Cantida de Servicios </th>

          <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialVentas.map((auto) => (
                      <tr key={auto.id}>
                        <td>{auto.vehiculo.modelo}</td>
                        <td>{auto.vehiculo.marca.nombre}</td>
                        <td>{auto.vehiculo.matricula}</td>
                        <td>${auto.price}</td>
                        <td>{auto.date}</td>

                        <td>{auto.vehiculo.ventaServicios?.length}</td>
                        <td>
                          <AiOutlineFileSearch size={29} style={{ marginRight: '10px', cursor: 'pointer' }} />
                          <GrHostMaintenance size={29} style={{ cursor: 'pointer' }} />
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
