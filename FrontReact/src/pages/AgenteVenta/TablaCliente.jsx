import React, { useState, useEffect } from 'react';
import { Form, Placeholder, Container, Row, Col, Card, Table, Modal, Button, Nav } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import Swal from 'sweetalert2';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import axios from "axios";

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

const CustomButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  color: white !important;
  &:hover {
    background-color: #026c6c !important;
  }
`;


const GlobalStyle = createGlobalStyle`

    body {
    overflow: hidden; /* 🔒 Bloquea la barra de desplazamiento del navegador */
  }
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
    overflow-y: auto; /* ✅ Mantiene el scroll solo en la tabla */
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
    transition: 0.3s ease;
  }
  .submit:hover {
    background-color: #026c6c;
    color: white;
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


export default function TablaCliente() {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const totalPages = Math.ceil(filteredClientes.length / recordsPerPage);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [errors, setErrors] = useState({});
    const [editModal, setEditModal] = useState(false);
    const [editedData, setEditedData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        telephone: '',
        estado: 'ACTIVO'
    });
    const [clienteGuardar,setClienteGuardar] = useState({})
    const [clienteAgregadoAhorita,setClienteAgregadoAhorita] = useState({})
    const [AgenteAgregadoAhorita,setAgenteAgregadoAhorita] = useState({})

    const [agentes,setAgentes] = useState([])


    const fetchClientes = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await axios.get("http://localhost:8080/cliente/buscar", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setClientes(response.data);
                setFilteredClientes(response.data); // ✅ Actualizamos ambos estados

            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log("No se encontró el token");
            setLoading(false);
        }
    };

    // ✅ Llamamos a fetchClientes cuando el componente se monta
    useEffect(() => {
        fetchClientes();
    }, []);


    useEffect(() => {
        setFilteredClientes(clientes);
    }, [clientes]);

    

    const handleSearch = (searchTerm) => {
        const filtered = clientes.filter(cliente =>
            Object.values(cliente).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredClientes(filtered);
        setCurrentPage(1);
    };

    const paginate = (page) => {
        if (page === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
        else if (page === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
        else if (typeof page === "number" && page >= 1 && page <= totalPages) setCurrentPage(page);
    };
    console.log("holaaaaas")
    console.log(clientes)

    

    const handleEdit = (cliente) => {
    
        if (!cliente || !cliente.id) {
            return;
        }
    
        setSelectedItem(cliente);
        setEditedData({
            nombre: cliente.name || '',
            apellidos: cliente.lastname || '',
            correo: cliente.email || '',
            telefono: cliente.telephone ? cliente.telephone.toString() : '',
            estado: cliente.estado || 'ACTIVO'
        });
    
        setEditModal(true);
    };
    
    
    const handleSaveChanges = async () => {
        if (!selectedItem || !selectedItem.id) {
            console.error("Error: No hay cliente seleccionado para editar.");
            return;
        }
    
        if (!validateFields()) {
            console.error("Error: Validación fallida, hay campos vacíos.");
            return;
        }
    
        const token = localStorage.getItem('token'); // 🔍 Obtener el token
    
        if (!token) {
            Swal.fire({
                title: "Error de autenticación",
                text: "Tu sesión ha expirado. Inicia sesión nuevamente.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }
    
        const clienteData = {
            name: editedData.nombre,
            lastname: editedData.apellidos,
            surname: editedData.apellidos,
            email: editedData.correo,
            telephone: editedData.telefono.toString(),
            username: selectedItem.username,
        };
    
    
        try {
            const response = await axios.put(
                `http://localhost:8080/api/auth/updateCliente/${selectedItem.id}`,
                clienteData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            console.log("✅ Respuesta del backend:", response.data);
    
            setTimeout(async () => {
                await fetchClientes();
                setEditModal(false);
                Swal.fire({
                    title: "¡Actualizado!",
                    text: "El cliente ha sido actualizado con éxito.",
                    icon: "success",
                    confirmButtonColor: "#018180",
                });
            }, 500);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el cliente. Verifica tu sesión o permisos.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
    };
    
    
    

    const handleToggleStatus = (cliente) => {
        Swal.fire({
            title: `¿Estás seguro de ${cliente.estado === "ACTIVO" ? "desactivar" : "activar"} a ${cliente.nombre}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "Cancelar",
            customClass: { confirmButton: 'btn-swal-confirmar', cancelButton: 'btn-swal-cancelar' },
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedClientes = clientes.map(c =>
                    c.id === cliente.id ? { ...c, estado: cliente.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : c
                );
                setClientes(updatedClientes);
                setFilteredClientes(updatedClientes);
                Swal.fire("¡Hecho!", `El estado de ${cliente.nombre} ha sido cambiado.`, "success");
            }
        });
    };

    const validateFields = () => {
        console.log("📌 Validando campos, datos actuales:", editedData); // 🔍 Depuración
    
        let newErrors = {};
    
        if (!editedData.nombre || editedData.nombre.trim() === '') {
            newErrors.nombre = "El nombre es requerido";
        }
    
        if (!editedData.apellidos || editedData.apellidos.trim() === '') {
            newErrors.apellidos = "Los apellidos son requeridos";
        }
    
        if (!editedData.correo || editedData.correo.trim() === '') {
            newErrors.correo = "El correo es requerido";
        } else if (!/\S+@\S+\.\S+/.test(editedData.correo)) {
            newErrors.correo = "Correo inválido";
        }
    
        if (!editedData.telefono || editedData.telefono.toString().trim() === '') {
            newErrors.telefono = "El teléfono es requerido";
        }
    
        setErrors(newErrors);
        console.log("❌ Errores detectados:", newErrors); // 🔍 Ver qué errores se detectaron
    
        return Object.keys(newErrors).length === 0;
    };
    
    
    const asociarGerenteCliente = async () => {


        try {
            await axios.put(`http://localhost:8080/clientes-agente/mover-cliente?idGerente=${AgenteAgregadoAhorita.id}&idCliente=${clienteGuardar.id}`,{ //quité esto : AgenteAgregadoAhorita, clienteGuardar
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            
            console.log("ya se asocio tu")

        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo completar el registro. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
        
    };

    

    const handleAddCliente = async () => {
        if (!validateFields()) return; // Validar los campos antes de continuar
        const clienteData = {
            name: editedData.nombre,
            surname: editedData.apellidos,
            lastname: editedData.apellidos,
            username: editedData.correo,
            email: editedData.correo,
            password: editedData.nombre,  // ✅ La contraseña será el nombre del cliente
            telephone: editedData.telefono
        };


        console.log("Datos enviados:", clienteData); // ✅ Verifica que password sea el nombre
        console.log("Datos enviados:", clienteData.name); // ✅ Verifica que password sea el nombre
        console.log("Datos enviados:", clienteData.password); // ✅ Verifica que password sea el nombre



        try {
            await axios.post('http://localhost:8080/api/auth/registerCliente', clienteData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            setClienteAgregadoAhorita(clienteData)


            await fetchClientes();
            setShowModal(false);
            setEditedData({ nombre: '', apellidos: '', correo: '', telefono: '', estado: 'ACTIVO' });
            await asociarGerenteCliente();

            /*useEffect(() => {
                asociarGerenteCliente();
            }, []);*/

            Swal.fire({
                title: "Registro Exitoso",
                text: `El cliente ha sido registrado correctamente. Su contraseña es: ${clienteData.password}`,
                icon: "success",
                confirmButtonColor: "#018180",
            });

        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo completar el registro. Inténtalo de nuevo.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
        }
        
    };
    

    console.log("cuscando clienteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")

    useEffect(() => {
        const clienteEncontrado = clientes.find(cliente => cliente.email === clienteAgregadoAhorita.email);
        if (clienteEncontrado) {
            setClienteGuardar(clienteEncontrado);
        }
    }, [clientes, clienteAgregadoAhorita]);  // 🔄 Se ejecuta solo cuando cambian estos valores

    const token = localStorage.getItem("token");
    const [correoAgente, setCorreoAgente] = useState("")

    
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
    }, []);  // 🔄 Se ejecuta solo una vez al montar el componente
    


    const fetchAgentes = async () => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const response = await axios.get("http://localhost:8080/api/auth/fullAgentes", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setAgentes(response.data);
                //setFilteredClientes(response.data); // ✅ Actualizamos ambos estados

            } catch (error) {
                console.error("Error al obtener clientes:", error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log("No se encontró el token");
            setLoading(false);
        }
    };

    // ✅ Llamamos a fetchClientes cuando el componente se monta
    useEffect(() => {
        fetchAgentes();
    }, []);

    useEffect(() => {
        const agenteEncontrado = agentes.find(agente => agente.email === correoAgente);
        if (agenteEncontrado) {
            setAgenteAgregadoAhorita(agenteEncontrado);
        }
    }, [clienteAgregadoAhorita,clienteGuardar]);  // 🔄 Se ejecuta solo cuando cambian estos valores

    console.log("El cliente a guardar es:",clienteGuardar)
    console.log("El cliente a guardar es:",AgenteAgregadoAhorita)




    

    return (
        <>
            <GlobalStyle />
            <Container>
                <Card>
                    <Row className="mb-3">
                        <Col className="d-flex justify-content-end">
                            <FiltroBuscador onSearch={handleSearch} placeholder="Buscar cliente..." />

                        </Col>
                    </Row>
                    <Row className="mb-1">
                        <Col>
                            <Nav variant="tabs" defaultActiveKey="/agentes">
                                <Nav.Item>
                                    <Nav.Link eventKey="/agentes"
                                        style={{
                                            backgroundColor: '#018180',
                                            border: '1px solidrgb(89, 104, 104)',
                                            borderRadius: '5px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)',
                                        }}
                                    >Clientes</Nav.Link>
                                </Nav.Item>
                                <Nav.Link
                                    className="text-dark ms-auto"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEditedData({ nombre: '', apellidos: '', correo: '', telefono: '', estado: 'ACTIVO' }); // ✅ Limpia los datos
                                        setShowModal(true);
                                    }}
                                >
                                    <i className="bi bi-plus-circle fs-2"></i>
                                </Nav.Link>

                            </Nav>
                        </Col>
                    </Row>




                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <StyledWrapper>
                            <Modal.Header closeButton>
                                <Modal.Title className="title">Registrar Cliente</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="form">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.nombre}
                                            onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                                            isInvalid={!!errors.nombre}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.apellidos}
                                            onChange={(e) => setEditedData({ ...editedData, apellidos: e.target.value })}
                                            isInvalid={!!errors.apellidos}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={editedData.correo}
                                            onChange={(e) => setEditedData({ ...editedData, correo: e.target.value })}
                                            isInvalid={!!errors.correo}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.telefono}
                                            onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
                                            isInvalid={!!errors.telefono}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.telefono}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <CustomButton variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </CustomButton>
                                <CustomButton variant="primary" onClick={handleAddCliente} className="submit">
                                    Registrar
                                </CustomButton>

                            </Modal.Footer>
                        </StyledWrapper>
                    </Modal>


                    <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                        <StyledWrapper>
                            <Modal.Header closeButton>
                                <Modal.Title className="title">Editar Cliente</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form className="form">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.nombre}
                                            onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Apellidos</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.apellidos}
                                            onChange={(e) => setEditedData({ ...editedData, apellidos: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={editedData.correo}
                                            onChange={(e) => setEditedData({ ...editedData, correo: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editedData.telefono}
                                            onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
                                        />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <CustomButton variant="secondary" onClick={() => setEditModal(false)}>
                                    Cancelar
                                </CustomButton>
                                <CustomButton variant="primary" onClick={handleSaveChanges}>
                                    Guardar Cambios
                                </CustomButton>
                            </Modal.Footer>
                        </StyledWrapper>
                    </Modal>

                    <StyledWrapper>
                        <div className="scrollable-table">
                            <Table striped bordered hover className="mt-2">
                                <CustomTableHeader>
                                    <tr>
                                        <th>Nombre(s)</th>
                                        <th>Apellido(s)</th>
                                        <th>Correo</th>
                                        <th>Número de Teléfono</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </CustomTableHeader>

                                <tbody>
                                    {filteredClientes.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage).map(cliente => (
                                        <tr key={cliente.id}>
                                            <td>{cliente.name}</td>
                                            <td>{cliente.lastname}</td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.telephone}</td>
                                            <td>{cliente.estado === "ACTIVO" ? "Activo" : "Desactivado"}</td>
                                            <td>
                                                <BsPencilSquare className="text-primary fs-4" onClick={() => handleEdit(cliente)} />
                                                {cliente.estado === "ACTIVO"
                                                    ? <BsToggleOn className="text-success fs-3" onClick={() => handleToggleStatus(cliente)} />
                                                    : <BsToggleOff className="text-danger fs-3" onClick={() => handleToggleStatus(cliente)} />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>


                            </Table>
                            <BootstrapPagination currentPage={currentPage} totalPages={totalPages} onPageChange={paginate} />
                        </div>
                    </StyledWrapper>
                </Card>
            </Container>
        </>
    );
}
