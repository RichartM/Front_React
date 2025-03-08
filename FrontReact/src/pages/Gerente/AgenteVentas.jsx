  import React, { useState, useEffect } from 'react';
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
  `;

  // Modal de Clientes: Se muestra el total de clientes que tiene el agente
  function ClientesModal({ show, onHide, agente, agentes, onTransfer, onTransferAll }) {
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [targetAgenteId, setTargetAgenteId] = useState("");
    const [targetAgenteAll, setTargetAgenteAll] = useState("");

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
        <Modal.Header closeButton>
          <Modal.Title>Clientes de {agente.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {agente.clientes && agente.clientes.length > 0 ? (
            <>
              <p>Total de clientes: {agente.clientes.length}</p>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre Cliente</th>
                    <th>Transferir a</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {agente.clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre}</td>
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
                                {a.nombre} {a.apellidos}
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
              </Table>
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
                          {a.nombre} {a.apellidos}
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
          <CustomButton variant="secondary" onClick={onHide}>
            Cerrar
          </CustomButton>
        </Modal.Footer>
      </Modal>
    );
  }

  function AgenteVentas() {
    useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAgenteModal, setShowAgenteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({
      email: '',
      lastname: '',
      name: '',
      password: '',
      state: true, // Por defecto, activo
      surname: '',
    });
    const [errors, setErrors] = useState({});

    // Estado inicial de agentes (incluye propiedad "clientes")
    const [agentes, setAgentes] = useState([
      {
        id: 1,
        nombre: "Juan1",
        apellidos: "Pérez",
        correo: "juan@example.com",
        telefono: "555-1234",
        estado: "ACTIVO",
        clientes: [
          { id: 1, nombre: "Cliente A" },
          { id: 2, nombre: "Cliente B" }
        ]
      },
      {
        id: 2,
        nombre: "María2",
        apellidos: "Gómez",
        correo: "maria@example.com",
        telefono: "555-5678",
        estado: "INACTIVO",
        clientes: [
          { id: 3, nombre: "Cliente C" }
        ]
      },
      // ... otros agentes
    ]);

    // Estado para registrar el resumen de movimientos (se muestra en alerta después de la transferencia)
    const [movements, setMovements] = useState([]);
    const addMovement = (movement) => {
      setMovements(prev => [movement, ...prev]);
    };

    // Estados para el modal de clientes
    const [showClientesModal, setShowClientesModal] = useState(false);
    const [selectedAgenteForClientes, setSelectedAgenteForClientes] = useState(null);

    const handleSearch = (term) => {
      setSearchTerm(term);
    };

    const filteredAgentes = agentes.filter(agente =>
      agente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agente.telefono.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
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

    const agregarAgente = (nuevoAgente) => {
      setAgentes([...agentes, { ...nuevoAgente, id: Date.now(), clientes: [] }]);
    };

    const handleEdit = (agente) => {
      setSelectedItem(agente);
      setEditedData({
        email: agente.email,
        lastname: agente.lastname,
        name: agente.name,
        password: agente.password,
        state: agente.state, // Siempre activo lo cambio por la el valor del objeto, pero podemos dejarlo comoestaba en caso de que falle
        surname : agente.surname,

      });
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

    const handleSaveChanges = () => {
      if (validateFields()) {
        if (selectedItem) {
          setAgentes(agentes.map(a => a.id === selectedItem.id ? { ...a, ...editedData } : a));
          console.log("datosssssssss a registrar: "+a.name)
          setEditModal(false);
          Swal.fire({
            title: "¡Guardado!",
            text: "Los cambios han sido guardados con éxito.",
            icon: "success",
            confirmButtonColor: "#018180",
            customClass: { confirmButton: 'btn-swal-confirmar' },
            buttonsStyling: false
          });
        }
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

    const handleAddAgente = () => {
      if (validateFields()) {
        agregarAgente(editedData);
        console.log("datosssssssss a registrar: "+editedData.name)
        console.log("datosssssssss a registrar: "+editedData)



        //const token = localStorage.getItem('token');  // Obtener el token del localStorage
        axios.post('http://localhost:8080/api/auth/registerAgente', editedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then(response => console.log('Agente registrado:', response.data))
        .catch(error => console.error('Error al registrar el agente:', error));
        




        setShowAgenteModal(false);
        setEditedData({ email: '', lastname: '', name: '', password: '', state: '',surname:'' });
        Swal.fire({
          title: "¡Agregado!",
          text: "El agente ha sido agregado con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false
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
          console.log("datos del modificado "+agente.name)
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
    
    const [agentesData,setAgentesData] = useState([])
    useEffect(() => {
      console.log("get the useEffect")
      const token = localStorage.getItem('token');  // Obtener el token del localStorage
      console.log("token: "+token)
  
      if (token) {
        axios.get('http://localhost:8080/api/auth/fullAgentes', {
          headers: {
            Authorization: `Bearer ${token}`  // Usar el token en el encabezado
          }
        })
        .then(response => {
          setAgentesData(response.data);
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
      } else {
        console.log('No se encontró el token');
      }
    }, []);

    
    return (
      <>
        <GlobalStyle />
        <Container>
          <Card>
            <Row className="mb-3">
              <Col className="d-flex justify-content-end">
                <FiltroServicios onSearch={handleSearch} placeholder="Buscar agentes..." />
              </Col>
            </Row>

            <Row className="mb-1">
              <Col>
                <Nav variant="tabs" defaultActiveKey="/agentes">
                  <Nav.Item>
                    <Nav.Link eventKey="/agentes"
                    style={{
                      backgroundColor: '#018180', // Fondo gris claro
                      border: '1px solidrgb(89, 104, 104)', // Borde con el color de acento
                      borderRadius: '5px',         // Bordes redondeados
                      boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)', // Sombra sutil para dar profundidad
                    }}
                    >Agentes de Ventas</Nav.Link>
                  </Nav.Item>
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
                        value={editedData.telefono}
                        onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
                        className="input"
                        isInvalid={!!errors.telefono}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>

                    
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <CustomButton
                    className="submit btn btn-primary"s
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
                <Table striped bordered hover className="mt-2">
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
                    {agentesData.map((agente) => (
                      <tr key={agente.id}>
                        <td>{agente.name}</td>
                        <td>{agente.lastname +" "+agente.surname}</td>
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
      </>
    );
  }

  export default AgenteVentas;
