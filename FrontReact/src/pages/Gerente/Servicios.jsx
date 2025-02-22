import React, { useState, useEffect } from 'react';
import { Form, Placeholder } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import Swal from 'sweetalert2';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import { createGlobalStyle } from "styled-components";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';

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
    color: #018180;
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
    background-color: #018180;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color: #018180;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .message,
  .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: #018180;
  }

  .signin a:hover {
    text-decoration: underline #018180;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    width: 100%;
    padding: 10px 10px 20px 10px;
    outline: 0;
    background-color: white;
    color: #747474;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    position: absolute;
    left: 10px;
    top: 15px;
    color: grey;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 15px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    top: 30px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .form label .input:valid + span {
    color: green;
  }

  .submit {
    border: none;
    outline: none;
    background-color: #018180;
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

export default function Servicios() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [showservicioModal, setShowservicioModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({
        identificador: '',
        nombreServicio: '',
        precio: '',
        periodo: '',
        estado: 'ACTIVO',
    });

    const [servicios, setservicios] = useState([
        { id: 1, identificador: "CA-001", nombreServicio: "Cambio Aceite", precio: "50", periodo: "Mensual", estado: "ACTIVO" },
        { id: 2, identificador: "CA-002", nombreServicio: "Cambio Filtro", precio: "30", periodo: "Mensual", estado: "ACTIVO" },
        { id: 3, identificador: "AL-003", nombreServicio: "Alineación", precio: "40", periodo: "Semestral", estado: "ACTIVO" },
        { id: 4, identificador: "BA-004", nombreServicio: "Balanceo", precio: "35", periodo: "Semestral", estado: "ACTIVO" },
        { id: 5, identificador: "RE-005", nombreServicio: "Revisión General", precio: "60", periodo: "Anual", estado: "ACTIVO" },
        { id: 6, identificador: "BF-006", nombreServicio: "Cambio Bujías", precio: "25", periodo: "Anual", estado: "ACTIVO" },
        { id: 7, identificador: "FB-007", nombreServicio: "Cambio Frenos", precio: "70", periodo: "Semestral", estado: "ACTIVO" },
        { id: 8, identificador: "RL-008", nombreServicio: "Rotación Llantas", precio: "45", periodo: "Semestral", estado: "ACTIVO" },
        { id: 9, identificador: "LT-009", nombreServicio: "Cambio Llantas", precio: "100", periodo: "Anual", estado: "ACTIVO" },
        { id: 10, identificador: "SP-010", nombreServicio: "Cambio Suspensión", precio: "120", periodo: "Anual", estado: "ACTIVO" },
        { id: 11, identificador: "EM-011", nombreServicio: "Revisión Eléctrica", precio: "55", periodo: "Semestral", estado: "ACTIVO" },
        { id: 12, identificador: "AB-012", nombreServicio: "Cambio Amortiguadores", precio: "90", periodo: "Anual", estado: "ACTIVO" },
        { id: 13, identificador: "CT-013", nombreServicio: "Cambio Correa de Tiempo", precio: "110", periodo: "Anual", estado: "ACTIVO" },
        { id: 14, identificador: "RF-014", nombreServicio: "Recarga de Refrigerante", precio: "40", periodo: "Anual", estado: "ACTIVO" },
        { id: 15, identificador: "LB-015", nombreServicio: "Cambio Luces", precio: "25", periodo: "Semestral", estado: "ACTIVO" },
        { id: 16, identificador: "CB-016", nombreServicio: "Cambio Batería", precio: "80", periodo: "Bienal", estado: "ACTIVO" },
        { id: 17, identificador: "ES-017", nombreServicio: "Escaneo Computarizado", precio: "60", periodo: "Anual", estado: "ACTIVO" },
        { id: 18, identificador: "TC-018", nombreServicio: "Cambio Termostato", precio: "50", periodo: "Anual", estado: "ACTIVO" },
        { id: 19, identificador: "IN-019", nombreServicio: "Inspección Técnica", precio: "55", periodo: "Anual", estado: "ACTIVO" },
        { id: 20, identificador: "TF-020", nombreServicio: "Cambio Tensor de Faja", precio: "75", periodo: "Anual", estado: "ACTIVO" },
        { id: 21, identificador: "DP-021", nombreServicio: "Diagnóstico de Potencia", precio: "65", periodo: "Anual", estado: "ACTIVO" },
        { id: 22, identificador: "CC-022", nombreServicio: "Cambio Catalizador", precio: "95", periodo: "Anual", estado: "ACTIVO" },
        { id: 23, identificador: "EV-023", nombreServicio: "Evaluación de Emisiones", precio: "35", periodo: "Anual", estado: "ACTIVO" },
        { id: 24, identificador: "CR-024", nombreServicio: "Cambio Radiador", precio: "120", periodo: "Bienal", estado: "ACTIVO" },
        { id: 25, identificador: "FF-025", nombreServicio: "Cambio Filtro de Combustible", precio: "30", periodo: "Anual", estado: "ACTIVO" }
    ]);

    const [filteredServicios, setFilteredServicios] = useState(servicios);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(filteredServicios.length / recordsPerPage);
    const currentServicios = filteredServicios.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    // Función para manejar la búsqueda en tiempo real
    const handleSearch = (searchTerm) => {
        const filtered = servicios.filter((servicio) =>
            servicio.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.nombreServicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.precio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            servicio.periodo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServicios(filtered);
        setCurrentPage(1); // Reinicia la paginación al realizar una búsqueda
    };

    // Función para manejar la paginación
    const paginate = (page) => {
        if (page === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (page === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (typeof page === "number" && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Función para editar un servicio
    const handleEdit = (servicio) => {
        setSelectedItem(servicio);
        setEditedData({
            identificador: servicio.identificador,
            nombreServicio: servicio.nombreServicio,
            precio: servicio.precio,
            periodo: servicio.periodo,
            estado: servicio.estado,
        });
        setEditModal(true);
    };

    // Función para validar los campos del formulario con validaciones adicionales
    const validateFields = () => {
        const { identificador, nombreServicio, precio, periodo } = editedData;
        if (!identificador.trim() || !nombreServicio.trim() || !precio.trim() || !periodo.trim()) {
            Swal.fire({
                title: "Error",
                text: "Todos los campos son obligatorios.",
                icon: "error",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: 'swal2-popup',
                    confirmButton: 'btn-swal-confirmar',
                },
                buttonsStyling: false,
            });
            return false;
        }
        if (identificador.trim().length < 3) {
            Swal.fire({
                title: "Error",
                text: "El identificador debe tener al menos 3 caracteres.",
                icon: "error",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: 'swal2-popup',
                    confirmButton: 'btn-swal-confirmar',
                },
                buttonsStyling: false,
            });
            return false;
        }
        if (nombreServicio.trim().length < 3) {
            Swal.fire({
                title: "Error",
                text: "El nombre del servicio debe tener al menos 3 caracteres.",
                icon: "error",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: 'swal2-popup',
                    confirmButton: 'btn-swal-confirmar',
                },
                buttonsStyling: false,
            });
            return false;
        }
        if (isNaN(precio)) {
            Swal.fire({
                title: "Error",
                text: "El precio debe ser un número.",
                icon: "error",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: 'swal2-popup',
                    confirmButton: 'btn-swal-confirmar',
                },
                buttonsStyling: false,
            });
            return false;
        }
        if (Number(precio) <= 0) {
            Swal.fire({
                title: "Error",
                text: "El precio debe ser mayor que 0.",
                icon: "error",
                confirmButtonText: "Entendido",
                customClass: {
                    popup: 'swal2-popup',
                    confirmButton: 'btn-swal-confirmar',
                },
                buttonsStyling: false,
            });
            return false;
        }
        return true;
    };

    // Función para guardar los cambios de un servicio editado
    const handleSaveChanges = () => {
        if (validateFields()) {
            const updatedServicios = servicios.map((servicio) =>
                servicio.id === selectedItem.id ? { ...servicio, ...editedData } : servicio
            );
            setservicios(updatedServicios);
            setFilteredServicios(updatedServicios); // Actualiza la lista filtrada
            setEditModal(false);
            Swal.fire({
                title: "¡Guardado!",
                text: "Los cambios han sido guardados con éxito.",
                icon: "success",
                confirmButtonColor: "#018180",
                customClass: { confirmButton: 'btn-swal-confirmar' }
            });
        }
    };

    // Función para agregar un nuevo servicio
    const agregarservicio = (nuevoServicio) => {
        if (validateFields()) {
            const newServicio = { ...nuevoServicio, id: servicios.length + 1 };
            const updatedServicios = [...servicios, newServicio];
            setservicios(updatedServicios);
            setFilteredServicios(updatedServicios); // Actualiza la lista filtrada
            setShowservicioModal(false);
            Swal.fire({
                title: "¡Agregado!",
                text: "El servicio ha sido agregado con éxito.",
                icon: "success",
                confirmButtonColor: "#018180",
                customClass: { confirmButton: 'btn-swal-confirmar' }
            });
        }
    };

    // Función para activar/desactivar un servicio
    const handleToggleStatus = (servicio) => {
        Swal.fire({
            title: `¿Estás seguro de ${servicio.estado === 'ACTIVO' ? 'desactivar' : 'activar'} a ${servicio.identificador}?`,
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
                const updatedServicio = { ...servicio, estado: servicio.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
                const updatedServicios = servicios.map((s) => (s.id === servicio.id ? updatedServicio : s));
                setservicios(updatedServicios);
                setFilteredServicios(updatedServicios); // Actualiza la lista filtrada
                Swal.fire({
                    title: "¡Hecho!",
                    text: `El estado de ${servicio.identificador} ha sido cambiado.`,
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
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            <FiltroBuscador onSearch={handleSearch} placeholder="Buscar servicio..." />
                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col>
                            <Nav variant="tabs" defaultActiveKey="/servicios">
                                <Nav.Item>
                                    <Nav.Link eventKey="/servicios">Servicios</Nav.Link>
                                </Nav.Item>
                                <Nav.Link
                                    className="text-dark ms-auto"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowservicioModal(true);
                                    }}
                                >
                                    <i className="bi bi-plus-circle fs-2"></i>
                                </Nav.Link>
                            </Nav>
                        </Col>
                    </Row>

                    {/* Modal para Agregar/Editar servicio */}
                    <Modal show={showservicioModal || editModal} onHide={() => { setShowservicioModal(false); setEditModal(false); }} centered>
                        <StyledWrapper>
                            <Modal.Header closeButton>
                                <Modal.Title className="title">{editModal ? "Editar servicio" : "Agregar servicio"}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="form">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Identificador</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.identificador}
                                            onChange={(e) => setEditedData({ ...editedData, identificador: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre servicio</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.nombreServicio}
                                            onChange={(e) => setEditedData({ ...editedData, nombreServicio: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Precio</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.precio}
                                            onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Periodo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.periodo}
                                            onChange={(e) => setEditedData({ ...editedData, periodo: e.target.value })}
                                            className="input"
                                            required
                                        />
                                    </Form.Group>

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
                                <Button className="submit btn btn-primary" variant="secondary" onClick={() => { setShowservicioModal(false); setEditModal(false); }}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={editModal ? handleSaveChanges : () => agregarservicio(editedData)} className="submit">
                                    {editModal ? "Guardar cambios" : "Agregar"}
                                </Button>
                            </Modal.Footer>
                        </StyledWrapper>
                    </Modal>

                    {/* Tabla de servicios de Ventas */}
                    <StyledWrapper>
                        <div className="scrollable-table">
                            <Table striped bordered hover className="mt-2">
                                <CustomTableHeader>
                                    <tr>
                                        <th>Identificador</th>
                                        <th>Nombre de Servicio</th>
                                        <th>Precio</th>
                                        <th>Periodo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </CustomTableHeader>
                                <tbody>
                                    {currentServicios.map((servicio) => (
                                        <tr key={servicio.id}>
                                            <td>{servicio.identificador}</td>
                                            <td>{servicio.nombreServicio}</td>
                                            <td>{servicio.precio}</td>
                                            <td>{servicio.periodo}</td>
                                            <td>{servicio.estado}</td>
                                            <td>
                                                <BsPencilSquare
                                                    className="text-primary me-5 fs-2"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleEdit(servicio)}
                                                />
                                                {servicio.estado === "ACTIVO" ? (
                                                    <BsToggleOn
                                                        className="text-success fs-1"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleToggleStatus(servicio)}
                                                    />
                                                ) : (
                                                    <BsToggleOff
                                                        className="text-danger fs-1"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => handleToggleStatus(servicio)}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {/* Paginador */}
                            <BootstrapPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={paginate}
                            />
                        </div>
                    </StyledWrapper>
                </Card>
            </Container>
        </>
    );
}
