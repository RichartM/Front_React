import React, { useState, useEffect, use } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapPagination from '../../components/common/BootstrapPagination';;
import { createGlobalStyle } from "styled-components";
import FiltroServicios from '../../components/Filtros/FiltroBuscador';
import ClientePNG from '../../img/cliente.png';
import axios from "axios"
import HistoricoVentas from './HistoricoVentas';
import AgenteVentasService from '../../services/GerenteService/AgenteVentasService';

// Estilos globales
const GlobalStyle = createGlobalStyle`
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

// Styled component para todos los botones (tono uniforme)
const CustomButton = styled(Button)`
    background-color: #018180 !important;
    border: none;
    color: white !important;
    &:hover {
      background-color: #026c6c !important;
    }
  `;

// Estilos para el encabezado de la tabla
const CustomTableHeader = styled.thead`
    th {
      background-color: #018180;
      color: white;
      text-align: center;
    }
  `;

  const StyledTable = styled(Table)`
  border-collapse: collapse; /* Fusiona los bordes de las celdas */
  width: 100%;

  th, td {
    border: 1px solid #dee2e6; /* Bordes consistentes */
    padding: 8px; /* Espaciado interno */
    text-align: center; /* Centrar el texto */
  }

  th {
    background-color: #018180; /* Color de fondo del encabezado */
    color: white; /* Color del texto del encabezado */
  }

  td {
    background-color: white; /* Color de fondo de las celdas */
  }
`;

// Estilos para el contenido del modal y la tabla
const StyledWrapper = styled.div`
    .scrollable-table {
      max-height: 400px;
      overflow-y: auto;
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
    .no-spinner {
      -moz-appearance: textfield;
    }
    .no-spinner::-webkit-outer-spin-button,
    .no-spinner::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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
      transform: 0.3s ease;
    }
    .submit:hover {
      background-color: #026c6c;
      color: white;
      border: none;
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
  .scrollable-table {
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #018180 #f1f1f1;
  }
  `;

// Modal de Clientes: Se muestra el total de clientes que tiene el agente
function ClientesModal({ show, onHide, agente, agentes, onTransfer, onTransferAll }) {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [targetAgenteId, setTargetAgenteId] = useState("");
  const [targetAgenteAll, setTargetAgenteAll] = useState("");

  const [clientess,setClientess] = useState([])
  console.log("agentess")
  console.log("agentess",agente)
  console.log("agentess",agentes)
  const fetchClientesEspecificos = async () => {
      const token = localStorage.getItem("token");
  
      if (token) {
          try {
              const response = await axios.get(`http://localhost:8080/clientes-agente/buscarClienteDelAgente?idAgente=${agente.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
  
              setClientess(response.data);
              //console.log("dataaaaaInsalubre",clientes)
              //setFilteredClientes(response.data);
  
              return response.data; // ⬅️ Retornamos los datos actualizados
  
          } catch (error) {
              console.error("Error al obtener clientes:", error);
          } finally {
              //setLoading(false);
          }
      } else {
          console.log("No se encontró el token");
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchClientesEspecificos();
    }, [onHide]
  ); // ✅ Se ejecuta cuando el estado cambie
  

  console.log("ya hay",clientess)

  const handleTransfer = () => {
    if (selectedClientId && targetAgenteId) {
      onTransfer(selectedClientId, agente.id, parseInt(targetAgenteId, 10));
      setSelectedClientId(null);
      setTargetAgenteId("");
    }
  };

  const handleTransferAll = () => {
    if (targetAgenteAll) {
      onTransferAll(agente.id, parseInt(targetAgenteAll, 10));
      setTargetAgenteAll("");
    }
  };


  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header >
        <Modal.Title>Clientes de {agente.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {clientess && clientess.length > 0 ? (
          <>
            <p>Total de clientes: {clientess.length}</p>
            <StyledTable striped hover className="mt-2">
            <CustomTableHeader>
                            <thead>
                <tr>
                  <th>Nombre Cliente</th>
                  <th>Transferir a</th>
                  <th>Acción</th>
                </tr>
              </thead>
              </CustomTableHeader>

              <tbody>
                {clientess.map(cliente => (
                  <tr key={cliente.id}>
                    <td>{cliente.name}</td>
                    <td>
                      <Form.Select
                        value={selectedClientId === cliente.id ? targetAgenteId : ""}
                        onChange={(e) => {
                          setSelectedClientId(cliente.id);
                          setTargetAgenteId(e.target.value);
                        }}
                      >
                        <option value="">Selecciona Agente</option>
                        {agentes
                          .filter(a => a.id !== agente.id)
                          .map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} {a.lastname}
                            </option>
                          ))
                        }
                      </Form.Select>
                    </td>
                    <td>
                      <CustomButton
                        size="sm"
                        onClick={handleTransfer}
                        disabled={!targetAgenteId || selectedClientId !== cliente.id}
                      >
                        Transferir
                      </CustomButton>
                    </td>
                  </tr>
                ))}
              </tbody>
              </StyledTable>
              <hr />
            <h5>Transferir TODOS los clientes</h5>
            <Row className="align-items-center">
              <Col md={6}>
                <Form.Select
                  value={targetAgenteAll}
                  onChange={(e) => setTargetAgenteAll(e.target.value)}
                >
                  <option value="">Selecciona Agente</option>
                  {agentes
                    .filter(a => a.id !== agente.id)
                    .map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} {a.lastname}
                      </option>
                    ))
                  }
                </Form.Select>
              </Col>
              <Col md={6}>
                <CustomButton
                  size="sm"
                  onClick={handleTransferAll}
                  disabled={!targetAgenteAll}
                >
                  Transferir Todos
                </CustomButton>
              </Col>
            </Row>
          </>
        ) : (
          <p>No hay clientes asignados a este agente.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton variant="secondary" onClick={() => { onHide();  setClientess(null);}}
        >
          Cerrar
        </CustomButton>
      </Modal.Footer>
    </Modal>
  );
}

function AgenteVentas() {
  const [agentes, setAgentes] = useState([]);
  const [showHistoricoVentasModal, setShowHistoricoVentasModal] = useState(false);
  const [selectedAgenteForHistorico, setSelectedAgenteForHistorico] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAgenteModal, setShowAgenteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const [editedData, setEditedData] = useState({
    email: '',
    lastname: '',
    name: '',
    password: '',
    state: true,
    surname: '',
    username: '',
    telephone: '' // Inicializa el campo teléfono
  });
  const [errors, setErrors] = useState({});
  const [movements, setMovements] = useState([]);
  const [showClientesModal, setShowClientesModal] = useState(false);
  const [selectedAgenteForClientes, setSelectedAgenteForClientes] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const agregarAgente = (nuevoAgente) => {
    setAgentes([...agentes, { ...nuevoAgente, id: Date.now(), clientes: [] }]);
  };

  console.log("Hola migos espeonque esto ya sirva")
  const handleEdit = (agente) => {
    console.log("telefonooooooooooooooooo:")
    console.log(agente)
    setSelectedItem(agente);
    setEditedData(prevState => ({
      ...prevState,
      email: agente.email,
      lastname: agente.lastname,
      name: agente.name,
      password: agente.name,
      state: agente.state,
      surname: agente.surname,
      username: agente.name,
      telephone: agente.telephone

    }));
    setEditModal(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!editedData.name.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!editedData.lastname.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios.";
    }
    if (!editedData.email.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(editedData.email)) {
      newErrors.correo = "El correo no es válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar cambios de agente
  // Guardar cambios de agente
  const handleSaveChanges = () => {
    if (validateFields()) {
      const token = localStorage.getItem('token');
      if (selectedItem) {
        AgenteVentasService.updateAgente(selectedItem.id, editedData, token)
          .then(updatedAgente => {
            // Actualizar el estado de los agentes con la respuesta de la API
            setAgentes(prevAgentes =>
              prevAgentes.map(a => (a.id === updatedAgente.id ? updatedAgente : a))
            );

            // Cerrar el modal de edición
            setEditModal(false);

            // Mostrar un mensaje de éxito
            Swal.fire({
              title: "¡Agregado!",
              text: "El agente ha sido agregado con éxito.",
              icon: "success",
              confirmButtonColor: "#018180",
              customClass: { confirmButton: 'btn-swal-confirmar' },
              buttonsStyling: false
            });
          })
          .catch(error => {
            console.error('Error al guardar cambios', error);
            Swal.fire('Error', 'Hubo un problema al guardar los cambios', 'error');
          });
      }
    }
  };


  const handleAddAgente = () => {
    if (validateFields()) {
      const nuevoAgente = {
        ...editedData,
        id: Date.now(), // Generar un ID temporal
        clientes: [], // Inicializar sin clientes
      };

      editedData.password = editedData.name;

      axios.post('http://localhost:8080/api/auth/registerAgente', editedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('Agente registrado:', response.data);

          // Actualiza el estado de agentes con el nuevo agente
          setAgentes(prevAgentes => [...prevAgentes, response.data]);  // Usamos el setter para actualizar el estado correctamente

          // Cerrar el modal y limpiar el formulario
          setShowAgenteModal(false);
          setEditedData({ email: '', lastname: '', name: '', password: '', state: true, surname: '', username: '', telephone: '' });

          // Mostrar mensaje de éxito
          Swal.fire({
            title: "¡Agregado!",
            text: "El agente ha sido agregado con éxito.",
            icon: "success",
            confirmButtonColor: "#018180",
            customClass: { confirmButton: 'btn-swal-confirmar' },
            buttonsStyling: false
          });
        })
        .catch(error => {
          console.error('Error al registrar el agente:', error);

          // Mostrar mensaje de error detallado
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "Hubo un problema al registrar el agente.",
            icon: "error",
            confirmButtonColor: "#018180",
            customClass: { confirmButton: 'btn-swal-confirmar' },
            buttonsStyling: false
          });
        });
    } else {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos obligatorios.",
        icon: "error",
        confirmButtonColor: "#018180",
        customClass: { confirmButton: 'btn-swal-confirmar' },
        buttonsStyling: false
      });
    }
  };

  useEffect(() => {
    console.log('Agentes actualizados:', agentes);
  }, [agentes]);  // Este efecto se ejecutará cada vez que el estado de `agentes` cambie




  const handleToggleStatus = (agente) => {
    Swal.fire({
      title: `¿Estás seguro de ${agente.state === true ? 'desactivar' : 'activar'} a ${agente.name}?`,
      text: "Esta acción cambiará su estado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup',
        confirmButton: 'btn-swal-confirmar',
        cancelButton: 'btn-swal-cancelar',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAgente = { ...agente, state: agente.state === true ? false : true };
        console.log("datos del modificado " + agente.name)
        setAgentes(agentes.map(a => a.id === agente.id ? updatedAgente : a));

        Swal.fire({
          title: "¡Hecho!",
          text: `El estado de ${agente.nombre} ha sido cambiado.`,
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false,
        });
      }
    });
  };

  // Al transferir un cliente, actualiza el agente (modal) para que muestre el nuevo total de clientes (0 si se transfirió todo)
  const handleTransferCliente = (clienteId, fromAgenteId, toAgenteId) => {
    const fromAgent = agentes.find(a => a.id === fromAgenteId);
    const toAgent = agentes.find(a => a.id === toAgenteId);
    setAgentes(prevAgentes => {
      const newAgentes = prevAgentes.map(agente => {
        if (agente.id === fromAgenteId) {
          return {
            ...agente,
            clientes: (agente.clientes || []).filter(cliente => cliente.id !== clienteId)
          };
        }
        if (agente.id === toAgenteId) {
          const fromAgente = prevAgentes.find(a => a.id === fromAgenteId);
          const clienteTransferido = fromAgente && fromAgente.clientes ? fromAgente.clientes.find(cliente => cliente.id === clienteId) : null;
          return {
            ...agente,
            clientes: [...(agente.clientes || []), clienteTransferido]
          };
        }
        return agente;
      });
      // Actualizamos el agente en el modal si es el que se está visualizando
      if (selectedAgenteForClientes && selectedAgenteForClientes.id === fromAgenteId) {
        setSelectedAgenteForClientes(newAgentes.find(a => a.id === fromAgenteId));
      }
      return newAgentes;
    });
    Swal.fire({
      title: "Transferencia realizada",
      html: `<p>Se transfirió 1 cliente de ${fromAgent?.nombre} a ${toAgent?.nombre}.</p>`,
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };

  const handleTransferAllClientes = (fromAgenteId, toAgenteId) => {
    const fromAgent = agentes.find(a => a.id === fromAgenteId);
    const clientesToTransfer = fromAgent ? (fromAgent.clientes || []) : [];
    const toAgent = agentes.find(a => a.id === toAgenteId);
    setAgentes(prevAgentes => {
      const newAgentes = prevAgentes.map(agente => {
        if (agente.id === fromAgenteId) {
          return { ...agente, clientes: [] };
        }
        if (agente.id === toAgenteId) {
          return { ...agente, clientes: [...(agente.clientes || []), ...clientesToTransfer] };
        }
        return agente;
      });
      if (selectedAgenteForClientes && selectedAgenteForClientes.id === fromAgenteId) {
        setSelectedAgenteForClientes(newAgentes.find(a => a.id === fromAgenteId));
      }
      return newAgentes;
    });
    Swal.fire({
      title: "Transferencia realizada",
      html: `<p>Se transfirieron ${clientesToTransfer.length} clientes de ${fromAgent?.nombre} a ${toAgent?.nombre}.</p>`,
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };

  useEffect(() => {
    console.log("get the useEffect");
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    console.log("token: " + token)

    if (token) {
      axios.get('http://localhost:8080/api/auth/fullAgentes', {
        headers: {
          Authorization: `Bearer ${token}`  // Usar el token en el encabezado
        }
      })
        .then(response => {
          setAgentes(response.data); // Solo esta llamada es suficiente
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
    } else {
      console.log('No se encontró el token');
    }
  }, []);


  const filteredAgentes = agentes
    .filter(agente => agente && agente.name && agente.lastname && agente.surname && agente.email)
    .filter(agente =>
      agente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPages = Math.ceil(filteredAgentes.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAgentes = filteredAgentes.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (page) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term); // Actualiza el término de búsqueda
    setCurrentPage(1);   // Reinicia la paginación a la primera página
  };

  return (
    <>
      <GlobalStyle />

      <Container>
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
          Agentes de Ventas
        </div>

        <Card>
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
            </Col>
          </Row>

          <Row className="mb-1">

            <Col>
              <Nav variant="tabs" defaultActiveKey="/agentes">
                <FiltroServicios onSearch={handleSearch} placeholder="Buscar agentes..." />

                <Nav.Link
                  className="text-dark ms-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAgenteModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle fs-2"></i>
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
          {/* Modal para Agregar/Editar Agente */}
          <Modal show={showAgenteModal || editModal} onHide={() => { setShowAgenteModal(false); setEditModal(false); }} centered>
            <StyledWrapper>
              <Modal.Header closeButton>
                <Modal.Title className="title">{editModal ? "Editar Agente" : "Agregar Agente"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form className="form">
                  {/* Campo Nombre */}
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.name}
                      onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      className="input"
                      isInvalid={!!errors.nombre}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nombre}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo Apellidos */}
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido paterno:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.lastname}
                      onChange={(e) => setEditedData({ ...editedData, lastname: e.target.value })}
                      className="input"
                      isInvalid={!!errors.apellidos}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.apellidos}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo Apellidos */}
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido materno:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.surname}
                      onChange={(e) => setEditedData({ ...editedData, surname: e.target.value })}
                      className="input"
                      isInvalid={!!errors.apellidos}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.apellidos}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo Correo */}
                  <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      value={editedData.email}
                      onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      className="input"
                      isInvalid={!!errors.correo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.correo}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Campo Teléfono */}
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.telephone}
                      onChange={(e) => setEditedData({ ...editedData, telephone: e.target.value })}
                      className="input"
                      isInvalid={!!errors.telephone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.telephone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <CustomButton
                  className="submit btn btn-primary"
                  variant="secondary"
                  onClick={() => { setShowAgenteModal(false); setEditModal(false); }}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={editModal ? handleSaveChanges : handleAddAgente}
                  className="submit"
                >
                  {editModal ? "Guardar cambios" : "Agregar"}
                </CustomButton>
              </Modal.Footer>
            </StyledWrapper>
          </Modal>

          {/* Tabla de Agentes de Ventas ----------------------------------------------------------------------------------------------------------------------------------------------*/}
          <StyledWrapper>
            <div className="scrollable-table">
              <Table striped  hover className="mt-2">
                <CustomTableHeader>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellidos</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </CustomTableHeader>
                <tbody>
                  {currentAgentes.map((agente) => (
                    <tr key={agente.id}>
                      <td>{agente.name}</td>
                      <td>{agente.lastname + " " + agente.surname}</td>
                      <td>{agente.email}</td>
                      <td>{(agente.state) ? "Activo" : "Inactivo"}</td>
                      <td>
                        <BsPencilSquare
                          className="text-primary me-2 fs-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(agente)}
                        />
                        {agente.state === true ? (
                          <BsToggleOn
                            className="text-success fs-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggleStatus(agente)}
                          />
                        ) : (
                          <BsToggleOff
                            className="text-danger fs-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggleStatus(agente)}
                          />
                        )}
                        <CustomButton
                          variant="info"
                          size="sm"
                          onClick={() => {
                            setSelectedAgenteForClientes(agente);
                            setShowClientesModal(true);
                          }}
                          className="ms-2"
                        >
                          <img src={ClientePNG} alt="Clientes" style={{ width: '20px', height: '20px' }} />
                        </CustomButton>

                        <CustomButton
                          variant="info"
                          size="sm"
                          onClick={() => {
                            setSelectedAgenteForHistorico(agente);
                            setShowHistoricoVentasModal(true);
                          }}
                          className="ms-2 fs-6"
                        >
                          <i className="bi bi-folder-fill"></i>
                        </CustomButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </StyledWrapper>

          {/* Paginador */}
          <BootstrapPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </Card>
      </Container>
      {/* Modal para Clientes */}
      {selectedAgenteForClientes && (
        <ClientesModal
          show={showClientesModal}
          onHide={() => setShowClientesModal(false)}
          agente={selectedAgenteForClientes}
          agentes={agentes}
          onTransfer={handleTransferCliente}
          onTransferAll={handleTransferAllClientes}
        />
      )}

      {/* Modal para Histórico de Ventas */}
      {selectedAgenteForHistorico && (
        <HistoricoVentas
          show={showHistoricoVentasModal}
          onHide={() => setShowHistoricoVentasModal(false)}
          agente={selectedAgenteForHistorico}
        />
      )}
    </>
  );
}

export default AgenteVentas;

