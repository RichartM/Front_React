import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapPagination from '../BootstrapPagination';
import { createGlobalStyle } from "styled-components";
import FiltroServicios from '../FILTROS/FiltroBuscador.JSX'; // Importar el componente FiltroServicios

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
    background-color: rgb(55, 159, 152);
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: 0.3s ease;
  }

  .submit:hover {
    background-color: rgb(255, 255, 255);
    color: #018180;
    border-width: 1px;
    border-style: solid;
    border-color: #018180;
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
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: '',
        estado: 'ACTIVO',
    });

    const [errors, setErrors] = useState({}); // Estado para manejar errores de validación

    // Estado inicial de agentes de ventas
    const [agentes, setAgentes] = useState([
        { id: 1, nombre: "Juan1", apellidos: "Pérez", correo: "juan@example.com", telefono: "555-1234", estado: "ACTIVO" },
        { id: 2, nombre: "María2", apellidos: "Gómez", correo: "maria@example.com", telefono: "555-5678", estado: "INACTIVO" },
        // ... otros agentes
    ]);

    // Función para manejar la búsqueda
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    // Filtrar agentes según el término de búsqueda
    const filteredAgentes = agentes.filter(agente =>
        agente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agente.telefono.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(filteredAgentes.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentAgentes = filteredAgentes.slice(indexOfFirstRecord, indexOfLastRecord);

    // Cambiar de página
    const paginate = (page) => {
        if (page === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (page === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (typeof page === "number") {
            setCurrentPage(page);
        }
    };

    // Función para agregar un nuevo agente de ventas
    const agregarAgente = (nuevoAgente) => {
        setAgentes([...agentes, { ...nuevoAgente, id: Date.now() }]);
    };

    // Función para editar un agente de ventas
    const handleEdit = (agente) => {
        setSelectedItem(agente);
        setEditedData({
            nombre: agente.nombre,
            apellidos: agente.apellidos,
            correo: agente.correo,
            telefono: agente.telefono,
            estado: agente.estado,
        });
        setEditModal(true);
    };

    // Función para validar los campos
    const validateFields = () => {
        const newErrors = {};

        if (!editedData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio.";
        }
        if (!editedData.apellidos.trim()) {
            newErrors.apellidos = "Los apellidos son obligatorios.";
        }
        if (!editedData.correo.trim()) {
            newErrors.correo = "El correo es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(editedData.correo)) {
            newErrors.correo = "El correo no es válido.";
        }
        if (!editedData.telefono.trim()) {
            newErrors.telefono = "El teléfono es obligatorio.";
        }

        setErrors(newErrors); // Actualizar el estado de errores
        return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
    };

    // Función para guardar cambios al editar
    const handleSaveChanges = () => {
        if (validateFields()) { // Validar campos antes de guardar
            if (selectedItem) {
                setAgentes(agentes.map(a => a.id === selectedItem.id ? { ...a, ...editedData } : a));
                setEditModal(false);
                Swal.fire("¡Guardado!", "Los cambios han sido guardados con éxito.", "success");
            }
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor, completa todos los campos obligatorios.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    };

    // Función para agregar un agente
    const handleAddAgente = () => {
        if (validateFields()) { // Validar campos antes de agregar
            agregarAgente(editedData);
            setShowAgenteModal(false);
            setEditedData({ nombre: '', apellidos: '', correo: '', telefono: '', estado: 'ACTIVO' }); // Limpiar el formulario
        } else {
            Swal.fire({
                title: "Error",
                text: "Por favor, completa todos los campos obligatorios.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    };

    // Función para cambiar el estado de un agente
    const handleToggleStatus = (agente) => {
        Swal.fire({
            title: `¿Estás seguro de ${agente.estado === 'ACTIVO' ? 'desactivar' : 'activar'} a ${agente.nombre}?`,
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
                const updatedAgente = { ...agente, estado: agente.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
                setAgentes(agentes.map(a => a.id === agente.id ? updatedAgente : a));
                Swal.fire({
                    title: "¡Hecho!",
                    text: `El estado de ${agente.nombre} ha sido cambiado.`,
                    icon: "success",
                    customClass: {
                        popup: 'swal2-popup',
                        confirmButton: 'btn-swal-confirmar',
                    },
                    buttonsStyling: false,
                });
            }
        });
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <Card>
                     {/* Filtro de búsqueda */}
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            <FiltroServicios onSearch={handleSearch} placeholder="Buscar agentes..." />
                        </Col>
                    </Row>

                    <Row className="mb-1">
                        <Col>
                            <Nav variant="tabs" defaultActiveKey="/agentes">
                                <Nav.Item>
                                    <Nav.Link eventKey="/agentes">Agentes de Ventas</Nav.Link>
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
                                            value={editedData.nombre}
                                            onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                                            className="input"
                                            isInvalid={!!errors.nombre}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.nombre}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Campo Apellidos */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.apellidos}
                                            onChange={(e) => setEditedData({ ...editedData, apellidos: e.target.value })}
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
                                            value={editedData.correo}
                                            onChange={(e) => setEditedData({ ...editedData, correo: e.target.value })}
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

                                    {/* Campo Estado */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Estado</Form.Label>
                                        <Form.Select
                                            value={editedData.estado}
                                            onChange={(e) => setEditedData({ ...editedData, estado: e.target.value })}
                                            className="input"
                                            required
                                        >
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="submit btn btn-primary" variant="secondary" onClick={() => { setShowAgenteModal(false); setEditModal(false); }}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={editModal ? handleSaveChanges : handleAddAgente} className="submit">
                                    {editModal ? "Guardar cambios" : "Agregar"}
                                </Button>
                            </Modal.Footer>
                        </StyledWrapper>
                    </Modal>

                    {/* Tabla de Agentes de Ventas */}
                    <StyledWrapper>
                        <div className="scrollable-table">
                            <Table striped bordered hover className="mt-2">
                                <CustomTableHeader>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellidos</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </CustomTableHeader>
                                <tbody>
                                    {currentAgentes.map((agente) => (
                                        <tr key={agente.id}>
                                            <td>{agente.nombre}</td>
                                            <td>{agente.apellidos}</td>
                                            <td>{agente.correo}</td>
                                            <td>{agente.telefono}</td>
                                            <td>{agente.estado}</td>
                                            <td>
                                                <BsPencilSquare
                                                    className="text-primary me-5 fs-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleEdit(agente)}
                                                />
                                                {agente.estado === "ACTIVO" ? (
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
        </>
    );
}

export default AgenteVentas;