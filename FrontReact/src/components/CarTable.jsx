import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapPagination from './BootstrapPagination';

const CustomTableHeader = styled.thead`
  background-color: red;
  color: white;
`;

const PaginateButton = styled(Button)`
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 50%;
  margin: 0 5px;
`;

const StyledModalContent = styled.div`
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
    color:rgb(55, 159, 152);
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
    color: royalblue;
  }

  .signin a:hover {
    text-decoration: underline royalblue;
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
    background-color:#018180;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: 0.3s ease;
    transition : 0.5s;
  }

  .submit:hover {
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

function CarTable() {
    // Bloquear el desplazamiento cuando el componente se monta
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Restaurar el desplazamiento cuando el componente se desmonta
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [activeTab, setActiveTab] = useState('/home');
    const [showMarcasModal, setShowMarcasModal] = useState(false);
    const [showModelosModal, setShowModelosModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({ nombre: '', estado: '' });
    const [marcas, setMarcas] = useState([
        { id: 1, nombre: "Chevrolet", estado: "ACTIVO" },
        { id: 2, nombre: "Toyota", estado: "INACTIVO" },
        // Más marcas...
    ]);
    const [modelos, setModelos] = useState([
        { id: 1, identificador: "CCL-10001-M", nombre: "Cambio llantas", precio: "$50000", periodo: "Única Aplicación", estado: "Activo" },
        { id: 2, identificador: "CCL-10002-M", nombre: "Alineación", precio: "$30000", periodo: "Mensual", estado: "Activo" },
        // Más modelos...
    ]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 15;

    // Calcular total de páginas
    const totalPagesMarcas = Math.ceil(marcas.length / recordsPerPage);
    const totalPagesModelos = Math.ceil(modelos.length / recordsPerPage);

    // Filtrar registros para la paginación
    const currentMarcas = marcas.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    const currentModelos = modelos.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

    // Cambiar de página
    const paginate = (page) => {
        if (page === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (page === "next" && currentPage < (activeTab === "/home" ? totalPagesMarcas : totalPagesModelos)) {
            setCurrentPage(currentPage + 1);
        } else if (typeof page === "number") {
            setCurrentPage(page);
        }
    };

    const handleOpenModal = () => {
        if (activeTab === "/home") {
            setShowMarcasModal(true);
        } else if (activeTab === "link-1") {
            setShowModelosModal(true);
        }
    };

    const agregarModelo = (nuevoModelo) => {
        setModelos([...modelos, { ...nuevoModelo, id: modelos.length + 1 }]);
        setShowModelosModal(false);
    };

    const agregarMarca = (nuevaMarca) => {
        setMarcas([...marcas, { ...nuevaMarca, id: marcas.length + 1 }]);
        setShowMarcasModal(false);
    };

    const handleEdit = (item, isMarca) => {
        setSelectedItem(item);
        setEditedData({
            identificador: item.identificador || "",
            nombre: item.nombre || "",
            precio: item.precio || "",
            periodo: item.periodo || "Mensual",
            estado: item.estado || "Activo"
        });
        setEditModal(true);
    };

    const handleSaveChanges = () => {
        if (selectedItem) {
            if (activeTab === "/home") {
                setMarcas(marcas.map(m => m.id === selectedItem.id ? { ...m, ...editedData } : m));
            } else {
                setModelos(modelos.map(m => m.id === selectedItem.id ? { ...m, ...editedData } : m));
            }
            setEditModal(false);
            Swal.fire("¡Guardado!", "Los cambios han sido guardados con éxito.", "success");
        }
    };

    const handleToggleStatus = (item, isMarca) => {
        Swal.fire({
            title: `¿Estás seguro de ${item.estado === 'ACTIVO' || item.estado === 'Activo' ? 'desactivar' : 'activar'} ${item.nombre}?`,
            text: "Esta acción cambiará su estado.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedItem = { ...item, estado: item.estado === 'ACTIVO' || item.estado === 'Activo' ? 'INACTIVO' : 'ACTIVO' };
                if (isMarca) {
                    setMarcas(marcas.map(m => m.id === item.id ? updatedItem : m));
                } else {
                    setModelos(modelos.map(m => m.id === item.id ? updatedItem : m));
                }
                Swal.fire(
                    "¡Hecho!",
                    `El estado de ${item.nombre} ha sido cambiado.`,
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
                        <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                            <Nav.Item>
                                <Nav.Link eventKey="/home">Marcas</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="link-1">Modelos</Nav.Link>
                            </Nav.Item>
                            <Nav.Link
                                className="text-dark ms-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleOpenModal();
                                }}
                            >
                                <i className="bi bi-plus-circle fs-2"></i>
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>

                {/* Modal para Marcas */}
                <Modal show={showMarcasModal} onHide={() => setShowMarcasModal(false)} centered>
                    <StyledModalContent>
                        <Modal.Header closeButton>
                            <Modal.Title className="title">Agregar Marca</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={(e) => {
                                e.preventDefault();
                                agregarMarca({ nombre: e.target.nombre.value, estado: 'ACTIVO' });
                            }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="submit">Agregar</Button>
                            </Form>
                        </Modal.Body>
                    </StyledModalContent>
                </Modal>

                {/* Modal para Modelos */}
                <Modal show={showModelosModal} onHide={() => setShowModelosModal(false)} centered>
                    <StyledModalContent>
                        <Modal.Header closeButton>
                            <Modal.Title className="title" >Agregar Modelo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={(e) => {
                                e.preventDefault();
                                agregarModelo({
                                    identificador: e.target.identificador.value,
                                    nombre: e.target.nombre.value,
                                    precio: e.target.precio.value,
                                    periodo: e.target.periodo.value,
                                    estado: 'Activo'
                                });
                            }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Identificador</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="identificador"
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="precio"
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Periodo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="periodo"
                                        className="input"
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="submit">Agregar</Button>
                            </Form>
                        </Modal.Body>
                    </StyledModalContent>
                </Modal>

                {/* Modal de Edición */}
                <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                    <StyledModalContent>
                        <Modal.Header closeButton>
                            <Modal.Title className="title" >Editar {selectedItem?.nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {selectedItem?.identificador && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Identificador</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.identificador}
                                            onChange={(e) => setEditedData({ ...editedData, identificador: e.target.value })}
                                            className="input"
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editedData.nombre}
                                        onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                                        className="input"
                                    />
                                </Form.Group>

                                {selectedItem?.precio !== undefined && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Precio</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            value={editedData.precio}
                                            onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                                            className="input"
                                        />
                                    </Form.Group>
                                )}

                                {selectedItem?.periodo && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Periodo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.periodo}
                                            onChange={(e) => setEditedData({ ...editedData, periodo: e.target.value })}
                                            className="input"
                                        />
                                    </Form.Group>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={editedData.estado}
                                        onChange={(e) => setEditedData({ ...editedData, estado: e.target.value })}
                                        className="input"
                                    >
                                        <option value="ACTIVO">ACTIVO</option>
                                        <option value="INACTIVO">INACTIVO</option>
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className="submit btn btn-primary" variant="secondary" onClick={() => setEditModal(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={handleSaveChanges} className="submit">Guardar cambios</Button>
                        </Modal.Footer>
                    </StyledModalContent>
                </Modal>

                {/* Tabla de Marcas */}
                {activeTab === "/home" && (
                    <div className="text-center mt-2">
                        <Table striped bordered hover className="mt-2">
                            <CustomTableHeader>
                                <tr>
                                    <th>Marca</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </CustomTableHeader>
                            <tbody>
                                {currentMarcas.map((marca) => (
                                    <tr key={marca.id}>
                                        <td>{marca.nombre}</td>
                                        <td>{marca.estado}</td>
                                        <td>
                                            <BsPencilSquare
                                                className="text-primary me-5 fs-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(marca, true)}
                                            />
                                            {marca.estado === "ACTIVO" ? (
                                                <BsToggleOn
                                                    className="text-success fs-1"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleStatus(marca, true)}
                                                />
                                            ) : (
                                                <BsToggleOff
                                                    className="text-danger fs-1"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleStatus(marca, true)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <BootstrapPagination
                            currentPage={currentPage}
                            totalPages={totalPagesMarcas}
                            onPageChange={(page) => paginate(page)}
                        />
                    </div>
                )}

                {/* Tabla de Modelos */}
                {activeTab === "link-1" && (
                    <div className="text-center mt-2">
                        <Table striped bordered hover className="mt-2">
                            <CustomTableHeader>
                                <tr>
                                    <th>Identificador</th>
                                    <th>Nombre del servicio</th>
                                    <th>Precio</th>
                                    <th>Periodo</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </CustomTableHeader>
                            <tbody>
                                {currentModelos.map((modelo) => (
                                    <tr key={modelo.id}>
                                        <td>{modelo.identificador}</td>
                                        <td>{modelo.nombre}</td>
                                        <td>{modelo.precio}</td>
                                        <td>{modelo.periodo}</td>
                                        <td>{modelo.estado}</td>
                                        <td>
                                            <BsPencilSquare
                                                className="text-primary me-5 fs-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(modelo, false)}
                                            />
                                            {modelo.estado === "Activo" ? (
                                                <BsToggleOn
                                                    className="text-success fs-1"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleStatus(modelo, false)}
                                                />
                                            ) : (
                                                <BsToggleOff
                                                    className="text-danger fs-1"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleToggleStatus(modelo, false)}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <BootstrapPagination
                            currentPage={currentPage}
                            totalPages={totalPagesModelos}
                            onPageChange={(page) => paginate(page)}
                        />
                    </div>
                )}
            </Card>
        </Container>
    );
}

export default CarTable;