import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import styled from 'styled-components';
import Swal from 'sweetalert2';
import BootstrapPagination from '../../components/common/BootstrapPagination'; // Importación del componente
import { createGlobalStyle } from "styled-components";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';

// Estilos globales
const GlobalStyle = createGlobalStyle`
  body {
    overflow: hidden;
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

// Styled component para unificar el estilo de todos los botones
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

// Estilos para el contenido del modal
const StyledModalContent = styled.div`
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
    background-color: #018180;
    padding: 10px;
    border-radius: 10px;
    color: white;
    font-size: 16px;
    transition: 0.5s;
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

// ===================== Funciones para modelos y marcas =====================

// Función para agregar una nueva marca y mostrar alerta de confirmación
const useAgregarMarca = (marcas, setMarcas, setShowMarcasModal) => {
  return (nuevaMarca) => {
    const newMarca = { ...nuevaMarca, id: marcas.length + 1 };
    const updatedMarcas = [...marcas, newMarca];
    setMarcas(updatedMarcas);
    setShowMarcasModal(false);
    Swal.fire({
      title: "¡Agregado!",
      text: "La marca ha sido agregada con éxito.",
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };
};

// Función para agregar un nuevo modelo y mostrar alerta de confirmación
const useAgregarModelo = (modelos, setModelos, setShowModelosModal) => {
  return (nuevoModelo) => {
    const newModelo = { ...nuevoModelo, id: modelos.length + 1 };
    const updatedModelos = [...modelos, newModelo];
    setModelos(updatedModelos);
    setShowModelosModal(false);
    Swal.fire({
      title: "¡Agregado!",
      text: "El modelo ha sido agregado con éxito.",
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };
};

// ===================== Componente Principal =====================


 function GerenteMarcaModelo() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Estados para pestañas, modales y edición
  const [activeTab, setActiveTab] = useState('/home');
  const [showMarcasModal, setShowMarcasModal] = useState(false);
  const [showModelosModal, setShowModelosModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editedData, setEditedData] = useState({ nombre: '', estado: '' });
  const [errors, setErrors] = useState({});

  const [marcas, setMarcas] = useState([
    { id: 1, nombre: "Chevrolet", estado: "ACTIVO" },
    { id: 2, nombre: "Toyota", estado: "INACTIVO" },
  ]);

  const [modelos, setModelos] = useState([
    { id: 1, identificador: "CCL-10001-M 1", nombre: "Cambio llantas", precio: "$50000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 2, identificador: "CCL-10002-M 2", nombre: "Alineación", precio: "$30000", periodo: "Mensual", estado: "Activo" },
    { id: 3, identificador: "CCL-10003-M 3", nombre: "Balanceo", precio: "$25000", periodo: "Mensual", estado: "Activo" },
    { id: 4, identificador: "CCL-10004-M 4", nombre: "Cambio de aceite", precio: "$40000", periodo: "Trimestral", estado: "Activo" },
    { id: 5, identificador: "CCL-10005-M 5", nombre: "Cambio de frenos", precio: "$70000", periodo: "Semestral", estado: "Activo" },
    { id: 6, identificador: "CCL-10006-M 6", nombre: "Cambio de batería", precio: "$90000", periodo: "Bienal", estado: "Activo" },
    { id: 7, identificador: "CCL-10007-M 7", nombre: "Cambio de bujías", precio: "$35000", periodo: "Anual", estado: "Activo" },
    { id: 8, identificador: "CCL-10008-M 8", nombre: "Cambio de filtro de aire", precio: "$20000", periodo: "Semestral", estado: "Activo" },
    { id: 9, identificador: "CCL-10009-M 9", nombre: "Revisión de motor", precio: "$80000", periodo: "Anual", estado: "Activo" },
    { id: 10, identificador: "CCL-10010-M 10", nombre: "Cambio de transmisión", precio: "$120000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 11, identificador: "CCL-10011-M 11", nombre: "Cambio de radiador", precio: "$110000", periodo: "Bienal", estado: "Activo" },
    { id: 12, identificador: "CCL-10012-M 12", nombre: "Revisión eléctrica", precio: "$45000", periodo: "Anual", estado: "Activo" },
    { id: 13, identificador: "CCL-10013-M 13", nombre: "Cambio de suspensión", precio: "$95000", periodo: "Bienal", estado: "Activo" },
    { id: 14, identificador: "CCL-10014-M 14", nombre: "Escaneo computarizado", precio: "$50000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 15, identificador: "CCL-10015-M 15", nombre: "Cambio de luces", precio: "$15000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 16, identificador: "CCL-10016-M 16", nombre: "Cambio de filtro de combustible", precio: "$28000", periodo: "Anual", estado: "Activo" },
    { id: 17, identificador: "CCL-10017-M 17", nombre: "Cambio de correa de tiempo", precio: "$75000", periodo: "Bienal", estado: "Activo" },
    { id: 18, identificador: "CCL-10018-M 18", nombre: "Cambio de termostato", precio: "$30000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 19, identificador: "CCL-10019-M 19", nombre: "Cambio de alternador", precio: "$85000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 20, identificador: "CCL-10020-M 20", nombre: "Cambio de catalizador", precio: "$100000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 21, identificador: "CCL-10021-M 21", nombre: "Cambio de bomba de gasolina", precio: "$65000", periodo: "Única Aplicación", estado: "Activo" },
    { id: 22, identificador: "CCL-10022-M 22", nombre: "Inspección general", precio: "$55000", periodo: "Anual", estado: "Activo" }
  ]);

  const [searchTermMarcas, setSearchTermMarcas] = useState('');
  const [searchTermModelos, setSearchTermModelos] = useState('');

  const filteredMarcas = marcas.filter(marca =>
    marca.nombre.toLowerCase().includes(searchTermMarcas.toLowerCase())
  );

  const filteredModelos = modelos.filter(modelo =>
    modelo.nombre.toLowerCase().includes(searchTermModelos.toLowerCase())
  );

  // Paginación para Marcas
  const [currentPageMarcas, setCurrentPageMarcas] = useState(1);
  const recordsPerPageMarcas = 10;
  const currentMarcas = filteredMarcas.slice(
    (currentPageMarcas - 1) * recordsPerPageMarcas,
    currentPageMarcas * recordsPerPageMarcas
  );

  // Paginación para Modelos
  const [currentPageModelos, setCurrentPageModelos] = useState(1);
  const recordsPerPageModelos = 10;
  const currentModelos = filteredModelos.slice(
    (currentPageModelos - 1) * recordsPerPageModelos,
    currentPageModelos * recordsPerPageModelos
  );

  const handleOpenModal = () => {
    if (activeTab === "/home") {
      setShowMarcasModal(true);
    } else if (activeTab === "link-1") {
      setShowModelosModal(true);
    }
  };

  // Funciones para agregar modelos y marcas con alertas
  const agregarModelo = (nuevoModelo) => {
    const newModelo = { ...nuevoModelo, id: modelos.length + 1 };
    const updatedModelos = [...modelos, newModelo];
    setModelos(updatedModelos);
    setShowModelosModal(false);
    Swal.fire({
      title: "¡Agregado!",
      text: "El modelo ha sido agregado con éxito.",
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };

  const agregarMarca = (nuevaMarca) => {
    const newMarca = { ...nuevaMarca, id: marcas.length + 1 };
    const updatedMarcas = [...marcas, newMarca];
    setMarcas(updatedMarcas);
    setShowMarcasModal(false);
    Swal.fire({
      title: "¡Agregado!",
      text: "La marca ha sido agregada con éxito.",
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: 'btn-swal-confirmar' },
      buttonsStyling: false
    });
  };

  const handleEdit = (item, isMarca) => {
    setSelectedItem({ ...item, isMarca });
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
    if (validateFields(editedData, selectedItem.isMarca)) {
      if (selectedItem.isMarca) {
        setMarcas(marcas.map(m => m.id === selectedItem.id ? { ...m, ...editedData } : m));
      } else {
        setModelos(modelos.map(m => m.id === selectedItem.id ? { ...m, ...editedData } : m));
      }
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
  };

  const handleToggleStatus = (item, isMarca) => {
    Swal.fire({
      title: `¿Estás seguro de ${item.estado === 'ACTIVO' || item.estado === 'Activo' ? 'desactivar' : 'activar'} ${item.nombre}?`,
      text: "Esta acción cambiará su estado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, confirmar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      confirmButtonColor: "#018180",
      customClass: {
        popup: 'swal2-popup',
        confirmButton: 'btn-swal-confirmar',
        cancelButton: 'btn-swal-cancelar'
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedItem = { ...item, estado: item.estado === 'ACTIVO' || item.estado === 'Activo' ? 'INACTIVO' : 'ACTIVO' };
        if (isMarca) {
          setMarcas(marcas.map(m => m.id === item.id ? updatedItem : m));
        } else {
          setModelos(modelos.map(m => m.id === item.id ? updatedItem : m));
        }
        Swal.fire({
          title: "¡Hecho!",
          text: `El estado de ${item.nombre} ha sido cambiado.`,
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false,
        });
      }
    });
  };

  const validateFields = (data, isMarca) => {
    const newErrors = {};
    if (!data.nombre || !data.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!isMarca) {
      if (!data.identificador || !data.identificador.trim()) newErrors.identificador = "El identificador es obligatorio.";
      if (!data.precio || !data.precio.toString().trim()) newErrors.precio = "El precio es obligatorio.";
      if (!data.periodo || !data.periodo.trim()) newErrors.periodo = "El periodo es obligatorio.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <GlobalStyle />

      <Container>
        <Card>
          <Row className="mb-3">
            <Col className="d-flex justify-content-end">
              {/* Filtro de búsqueda para Modelos */}
              {activeTab === "link-1" && (
                <FiltroBuscador onSearch={setSearchTermModelos} placeholder="Buscar modelos..." />
              )}
              {/* Filtro de búsqueda para Marcas */}
              {activeTab === "/home" && (
                <FiltroBuscador onSearch={setSearchTermMarcas} placeholder="Buscar marcas..." />
              )}
            </Col>
          </Row>

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
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const nombre = e.target.nombre.value;
                    if (validateFields({ nombre }, true)) {
                      agregarMarca({ nombre, estado: 'ACTIVO' });
                    }
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" className="input" isInvalid={!!errors.nombre} />
                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                  </Form.Group>
                  <Modal.Footer>
                    <CustomButton variant="secondary" onClick={() => setShowMarcasModal(false)}>
                      Cancelar
                    </CustomButton>
                    <CustomButton type="submit">Agregar</CustomButton>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </StyledModalContent>
          </Modal>

          {/* Modal para Modelos */}
          <Modal show={showModelosModal} onHide={() => setShowModelosModal(false)} centered>
            <StyledModalContent>
              <Modal.Header closeButton>
                <Modal.Title className="title">Agregar Modelo</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = {
                      identificador: e.target.identificador.value,
                      nombre: e.target.nombre.value,
                      precio: e.target.precio.value,
                      periodo: e.target.periodo.value,
                    };
                    if (validateFields(data, false)) {
                      agregarModelo({ ...data, estado: 'Activo' });
                    }
                  }}
                >
                  <Form.Group className="mb-3">
                    <Form.Label>Identificador</Form.Label>
                    <Form.Control type="text" name="identificador" className="input" isInvalid={!!errors.identificador} />
                    <Form.Control.Feedback type="invalid">{errors.identificador}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" className="input" isInvalid={!!errors.nombre} />
                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number" step="0.01" name="precio" className="input" isInvalid={!!errors.precio} />
                    <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Periodo</Form.Label>
                    <Form.Control type="text" name="periodo" className="input" isInvalid={!!errors.periodo} />
                    <Form.Control.Feedback type="invalid">{errors.periodo}</Form.Control.Feedback>
                  </Form.Group>
                  <Modal.Footer>
                    <CustomButton variant="secondary" onClick={() => setShowModelosModal(false)}>
                      Cancelar
                    </CustomButton>
                    <CustomButton type="submit">Agregar</CustomButton>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </StyledModalContent>
          </Modal>

          {/* Modal de Edición */}
          <Modal show={editModal} onHide={() => { setEditModal(false); setErrors({}); }} centered>
            <StyledModalContent>
              <Modal.Header closeButton>
                <Modal.Title className="title">Editar {selectedItem?.nombre}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {!selectedItem?.isMarca && (
                    <Form.Group className="mb-3">
                      <Form.Label>Identificador</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedData.identificador}
                        onChange={(e) => setEditedData({ ...editedData, identificador: e.target.value })}
                        className="input"
                        isInvalid={!!errors.identificador}
                      />
                      <Form.Control.Feedback type="invalid">{errors.identificador}</Form.Control.Feedback>
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.nombre}
                      onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                      className="input"
                      isInvalid={!!errors.nombre}
                    />
                    <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                  </Form.Group>
                  {!selectedItem?.isMarca && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={editedData.precio}
                          onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                          className="input"
                          isInvalid={!!errors.precio}
                        />
                        <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Periodo</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedData.periodo}
                          onChange={(e) => setEditedData({ ...editedData, periodo: e.target.value })}
                          className="input"
                          isInvalid={!!errors.periodo}
                        />
                        <Form.Control.Feedback type="invalid">{errors.periodo}</Form.Control.Feedback>
                      </Form.Group>
                    </>
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
                <CustomButton variant="secondary" onClick={() => { setEditModal(false); setErrors({}); }}>
                  Cancelar
                </CustomButton>
                <CustomButton variant="primary" onClick={handleSaveChanges}>
                  Guardar cambios
                </CustomButton>
              </Modal.Footer>
            </StyledModalContent>
          </Modal>
  
          {/* Tabla de Marcas */}
          <StyledModalContent>
            {activeTab === "/home" && (
              <div className="scrollable-table">
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
                {/* Paginador para Marcas */}
                <BootstrapPagination
                  currentPage={currentPageMarcas}
                  totalPages={Math.ceil(filteredMarcas.length / recordsPerPageMarcas)}
                  onPageChange={(page) => setCurrentPageMarcas(page)}
                />
              </div>
            )}
          </StyledModalContent>
  
          {/* Tabla de Modelos */}
          <StyledModalContent>
            {activeTab === "link-1" && (
              <div className="scrollable-table" style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                {/* Paginador para Modelos */}
                <BootstrapPagination
                  currentPage={currentPageModelos}
                  totalPages={Math.ceil(filteredModelos.length / recordsPerPageModelos)}
                  onPageChange={(page) => setCurrentPageModelos(page)}
                />
              </div>
            )}
          </StyledModalContent>
        </Card>
      </Container>
    </>
  );
}

export default GerenteMarcaModelo;
