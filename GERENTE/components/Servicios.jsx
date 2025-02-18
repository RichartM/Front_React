import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Swal from 'sweetalert2';
import BootstrapPagination from '../../src/components/BootstrapPagination';


const CustomTableHeader = styled.thead`
  background-color: red;
  color: white;
`;



const StyledWrapper = styled.div`
/* Botón de Confirmación (Sí, confirmar) */
.btn-swal-confirmar {
    background-color: #28a745 !important;  /* Verde */
    color: white !important;
    border: none !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    font-size: 16px !important;
    cursor: pointer !important;
}

/* Botón de Cancelar */
.btn-swal-cancelar {
    background-color: #dc3545 !important;  /* Rojo */
    color: white !important;
    border: none !important;
    padding: 10px 20px !important;
    border-radius: 5px !important;
    font-size: 16px !important;
    cursor: pointer !important;
}

/* Asegura que los botones se vean bien al hacer hover */
.btn-swal-confirmar:hover {
    background-color: #218838 !important;
}

.btn-swal-cancelar:hover {
    background-color: #c82333 !important;
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

  align-items: center;

  .title {
    font-size: 28px;
    color:  #018180;
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
    background-color:  #018180;
  }

  .title::before {
    width: 18px;
    height: 18px;
    background-color:  #018180;
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
    color:  #018180;
  }

  .signin a:hover {
    text-decoration: underline  #018180;
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
    background-color:  #018180;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: 0.3s ease;
  }

  .submit:hover {
    background-color: rgb(255,255,255);
    color: #018180;
    border-width: 1px;
    border-style: solid;
    border-color: #018180;  }

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
    // Bloquear el desplazamiento cuando el componente se monta
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Restaurar el desplazamiento cuando el componente se desmonta
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

    // Estado inicial de servicios de autos
    const [servicios, setservicios] = useState([
        { id: 1, identificador: "CA-001", nombreServicio: "Cambio Aceite", precio: "50", periodo: "Mensual", estado: "ACTIVO" },
        { id: 1, identificador: "CA-001", nombreServicio: "Cambio Aceite", precio: "50", periodo: "Mensual", estado: "ACTIVO" },

    ])
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    // Calcular total de páginas
    const totalPages = Math.ceil(servicios.length / recordsPerPage);

    // Filtrar registros para la paginación
    const currentservicios = servicios.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

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

    // Función para agregar un nuevo servicio de ventas
    const agregarservicio = (nuevoservicio) => {
        setservicios([...servicios, { ...nuevoservicio, id: Date.now() }]);
    };

    // Función para editar un servicio de ventas
    const handleEdit = (servicio) => {
        setSelectedItem(servicio);
        setEditedData({
            identificador: servicio.identificador,
            precio: servicio.precio,
            periodo: servicio.periodo,
            telefono: servicio.telefono,
            estado: servicio.estado,
        });
        setEditModal(true);
    };

    // Función para guardar cambios al editar
    const handleSaveChanges = () => {
        if (selectedItem) {
            setservicios(servicios.map(a => a.id === selectedItem.id ? { ...a, ...editedData } : a));
            setEditModal(false);
            Swal.fire("¡Guardado!", "Los cambios han sido guardados con éxito.", "success");
        }
    };

    
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
            popup: 'mi-alerta',
            confirmButton: 'btn-swal-confirmar',
            cancelButton: 'btn-swal-cancelar'
        },
        buttonsStyling: false  // ⚠️ IMPORTANTE: Desactiva los estilos predeterminados de SweetAlert2
    }).then((result) => {
        if (result.isConfirmed) {
            const updatedservicio = { ...servicio, estado: servicio.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
            setservicios(servicios.map(a => a.id === servicio.id ? updatedservicio : a));
            Swal.fire({
                title: "¡Hecho!",
                text: `El estado de ${servicio.identificador} ha sido cambiado.`,
                icon: "success",
                customClass: {
                    popup: 'mi-alerta',
                    confirmButton: 'btn-swal-confirmar'
                },
                buttonsStyling: false  // ⚠️ Se asegura que los estilos se apliquen
            });
        }
    });
};

    


    return (
        <Container>
            <Card>
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
                                    <Form.Label>precio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.precio}
                                        onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                                        className="input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>periodo</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={editedData.periodo}
                                        onChange={(e) => setEditedData({ ...editedData, periodo: e.target.value })}
                                        className="input"
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
                            <Button variant="primary" onClick={editModal ? handleSaveChanges : () => { agregarservicio(editedData); setShowservicioModal(false); }} className="submit">
                                {editModal ? "Guardar cambios" : "Agregar"}
                            </Button>
                        </Modal.Footer>
                    </StyledWrapper>
                </Modal>

                {/* Tabla de servicios de Ventas */}
                <div className="text-center mt-2">
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
                            {currentservicios.map((servicio) => (
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

