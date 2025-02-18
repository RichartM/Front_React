import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapPagination from '../../src/components/BootstrapPagination';

const CustomTableHeader = styled.thead`
  background-color: red;
  color: white;
`;



const StyledWrapper = styled.div`
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

  align-items: center;

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

  .message,
  .signin {
    color: rgba(88, 87, 87, 0.822);
    font-size: 14px;
  }

  .signin {
    text-align: center;
  }

  .signin a {
    color: rgb(55, 159, 152);
  }

.signin a:hover {
    text-decoration: underline rgb(55, 159, 152);


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

  .submit  {
    border: none;
    outline: none;
    background-color: rgb(55, 159, 152);
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: 0.3s ease;
  }

  .submit:hover  {
    background-color: rgb(255,255,255);
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
    // Bloquear el desplazamiento cuando el componente se monta
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Restaurar el desplazamiento cuando el componente se desmonta
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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

    // Estado inicial de agentes de ventas
    const [agentes, setAgentes] = useState([
        { id: 1, nombre: "Juan", apellidos: "Pérez", correo: "juan@example.com", telefono: "555-1234", estado: "ACTIVO" },
        { id: 2, nombre: "María", apellidos: "Gómez", correo: "maria@example.com", telefono: "555-5678", estado: "INACTIVO" },
        // Agrega más agentes si es necesario
    ]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    // Calcular total de páginas
    const totalPages = Math.ceil(agentes.length / recordsPerPage);

    // Filtrar registros para la paginación
    const currentAgentes = agentes.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

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

    // Función para guardar cambios al editar
    const handleSaveChanges = () => {
        if (selectedItem) {
            setAgentes(agentes.map(a => a.id === selectedItem.id ? { ...a, ...editedData } : a));
            setEditModal(false);
            Swal.fire("¡Guardado!", "Los cambios han sido guardados con éxito.", "success");
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
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedAgente = { ...agente, estado: agente.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
                setAgentes(agentes.map(a => a.id === agente.id ? updatedAgente : a));
                Swal.fire(
                    "¡Hecho!",
                    `El estado de ${agente.nombre} ha sido cambiado.`,
                    "success"
                );
            }
        });
    };

    return (
        <Container>
            <Card>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.nombre}
                                        onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.apellidos}
                                        onChange={(e) => setEditedData({ ...editedData, apellidos: e.target.value })}
                                        className="input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={editedData.correo}
                                        onChange={(e) => setEditedData({ ...editedData, correo: e.target.value })}
                                        className="input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.telefono}
                                        onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
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
                            <Button className="submit btn btn-primary"variant="secondary" onClick={() => { setShowAgenteModal(false); setEditModal(false); }}>
                                Cancelar
                            </Button>
                            <Button className="btnColor" variant="primary" onClick={editModal ? handleSaveChanges : () => { agregarAgente(editedData); setShowAgenteModal(false); }} className="submit">
                                {editModal ? "Guardar cambios" : "Agregar"}
                            </Button>
                        </Modal.Footer>
                    </StyledWrapper>
                </Modal>

                {/* Tabla de Agentes de Ventas */}
                <div className="text-center mt-2">
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
                    <BootstrapPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => paginate(page)}
                    />
                </div>
            </Card>
        </Container>
    );
}

export default AgenteVentas;