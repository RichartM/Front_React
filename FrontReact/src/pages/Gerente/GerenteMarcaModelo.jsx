import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import { Container, Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import styled, { createGlobalStyle } from 'styled-components';
import Swal from 'sweetalert2';
import TablaMarcas from './TablaMarcas';
import TablaModelos from './TablaModelos';
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import axios from 'axios';

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

const CustomButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  color: white !important;
  &:hover {
    background-color: #026c6c !important;
  }
`;

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
  const [editedData, setEditedData] = useState({});
  const [errors, setErrors] = useState({});

  // Registros para marcas y modelos
  const [marcas, setMarcas] = useState([
    { id: 1, nombre: "Chevrolet", estado: "ACTIVO" },
    { id: 2, nombre: "Toyota", estado: "INACTIVO" },
  ]);

  const [modelos, setModelos] = useState([
    { id: 1, modelo: "Sedan-X1", marca: "Toyota", placa: "XYZ-123", precio: "$350,000", año: "2024", color: "Negro", descripcion: "Auto compacto con llantas nuevas", estado: "Activo" },
    { id: 2, modelo: "SUV-A2", marca: "Ford", placa: "ABC-456", precio: "$450,000", año: "2023", color: "Gris", descripcion: "SUV familiar con cambio de neumáticos", estado: "Activo" },
    { id: 3, modelo: "Coupe-Z3", marca: "Chevrolet", placa: "LMN-789", precio: "$600,000", año: "2025", color: "Azul", descripcion: "Deportivo con neumáticos de alto desempeño", estado: "Activo" },
    { id: 4, modelo: "PickUp-Y4", marca: "Nissan", placa: "QRS-987", precio: "$480,000", año: "2022", color: "Blanco", descripcion: "Camioneta con llantas reforzadas para carga", estado: "Activo" },
    { id: 5, modelo: "Hatchback-W5", marca: "Volkswagen", placa: "TUV-654", precio: "$320,000", año: "2023", color: "Rojo", descripcion: "Compacto con ruedas nuevas y balanceo", estado: "Activo" }
  ]);

  // Estados para búsqueda y paginación
  const [searchTermMarcas, setSearchTermMarcas] = useState('');
  const [searchTermModelos, setSearchTermModelos] = useState('');
  const [currentPageMarcas, setCurrentPageMarcas] = useState(1);
  const [currentPageModelos, setCurrentPageModelos] = useState(1);
  const recordsPerPageMarcas = 10;
  const recordsPerPageModelos = 10;

  const handleOpenModal = () => {
    if (activeTab === "/home") {
      setShowMarcasModal(true);
    } else if (activeTab === "link-1") {
      setShowModelosModal(true);
    }
  };

  // Funciones para agregar registros
  const agregarModelo = (nuevoModelo) => {
    const newModelo = { ...nuevoModelo, id: modelos.length + 1 };
    setModelos([...modelos, newModelo]);
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
    setMarcas([...marcas, newMarca]);
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

  // Función para editar registros (diferencia entre marca y modelo)
  const handleEdit = (item, isMarca) => {
    setSelectedItem({ ...item, isMarca });
    if (isMarca) {
      setEditedData({
        nombre: item.nombre,
        estado: item.estado,
      });
    } else {
      setEditedData({
        modelo: item.modelo,
        marca: item.marca,
        placa: item.placa,
        precio: item.precio,
        año: item.año,
        color: item.color,
        descripcion: item.descripcion,
        estado: item.estado,
      });
    }
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
      title: `¿Estás seguro de ${item.estado === 'ACTIVO' || item.estado === 'Activo' ? 'desactivar' : 'activar'} ${isMarca ? item.nombre : item.modelo}?`,
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
        const updatedItem = { ...item, estado: (item.estado === 'ACTIVO' || item.estado === 'Activo') ? 'INACTIVO' : 'Activo' };
        if (isMarca) {
          setMarcas(marcas.map(m => m.id === item.id ? updatedItem : m));
        } else {
          setModelos(modelos.map(m => m.id === item.id ? updatedItem : m));
        }
        Swal.fire({
          title: "¡Hecho!",
          text: `El estado ha sido cambiado.`,
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false,
        });
      }
    });
  };

  // Validación de campos (para marca y para modelo)
  const validateFields = (data, isMarca) => {
    const newErrors = {};
    if (isMarca) {
      if (!data.nombre || !data.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    } else {
      if (!data.modelo || !data.modelo.trim()) newErrors.modelo = "El modelo es obligatorio.";
      if (!data.marca || !data.marca.trim()) newErrors.marca = "La marca es obligatoria.";
      if (!data.placa || !data.placa.trim()) newErrors.placa = "La placa es obligatoria.";
      if (!data.precio || !data.precio.toString().trim()) newErrors.precio = "El precio es obligatorio.";
      if (!data.año || !data.año.toString().trim()) newErrors.año = "El año es obligatorio.";
      if (!data.color || !data.color.trim()) newErrors.color = "El color es obligatorio.";
      if (!data.descripcion || !data.descripcion.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  ///OBTENIENDO LAS MARCAS DE LA BASE DE DARTO
  const [marcasReales,setMarcasREales] = useState([])

 useEffect(() => {
       console.log("get the useEffect")
       const token = localStorage.getItem('token');  // Obtener el token del localStorage
       console.log("token: "+token)
   
       if (token) {
         axios.get('http://localhost:8080/servicios/obtener', {
           headers: {
             Authorization: `Bearer ${token}`  // Usar el token en el encabezado
           }
         })
         .then(response => {
          setMarcasREales(response.data);
           console.log(response.data)
         })
         .catch(error => {
           console.error('Error al obtener los datos:', error);
         });
       } else {
         console.log('No se encontró el token');
       }
     }, []);

       ///OBTENIENDO LOS MODELOS DE LA BASE DE DARTO
  const [modelosReales,setModelosREales] = useState([])

  useEffect(() => {
        console.log("get the useEffect")
        const token = localStorage.getItem('token');  // Obtener el token del localStorage
        console.log("token: "+token)
    
        if (token) {
          axios.get('http://localhost:8080/vehiculo/obtener', {
            headers: {
              Authorization: `Bearer ${token}`  // Usar el token en el encabezado
            }
          })
          .then(response => {
            setModelosREales(response.data);
            console.log(response.data)
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
          });
        } else {
          console.log('No se encontró el token');
        }
      }, []);


      const handleSearchMarcas = (term) => {
        setSearchTermMarcas(term);
        setCurrentPageMarcas(1); // Reinicia la paginación a la primera página al buscar
    };
    
    const handleSearchModelos = (term) => {
        setSearchTermModelos(term);
        setCurrentPageModelos(1); // Reinicia la paginación a la primera página al buscar
    };
    

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          {/* Fila para pestañas, filtro e ícono de agregar */}
          <Row className="mb-1 align-items-center">
            <Col xs={8}>
              <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                <Nav.Item>
                  <Nav.Link
                    eventKey="/home"
                    style={
                      activeTab === "/home"
                        ? { backgroundColor: '#026c6c', border: '1px solid rgb(89, 104, 104)', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)', color: 'white', margin: '0 5px', fontWeight: 'bold' }
                        : { backgroundColor: '#018180', border: '1px solid rgb(89, 104, 104)', borderRadius: '5px', boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)', color: 'white', margin: '0 5px', padding: '5px 10px' }
                    }
                  >
                    Marcas
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="link-1"
                    style={
                      activeTab === "link-1"
                        ? { backgroundColor: '#026c6c', border: '1px solid rgb(89, 104, 104)', borderRadius: '3px', boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)', color: 'white', margin: '0 5px', fontWeight: 'bold' }
                        : { backgroundColor: '#018180', border: '1px solid rgb(89, 104, 104)', borderRadius: '3px', boxShadow: '0 4px 6px rgba(0, 0, 1, 0.3)', color: 'white', margin: '0 5px', padding: '5px 10px' }
                    }
                  >
                    Modelos
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xs={4} className="d-flex justify-content-end align-items-center">
            <FiltroBuscador
    onSearch={activeTab === '/home' ? handleSearchMarcas : handleSearchModelos}
    placeholder={activeTab === '/home' ? "Buscar marcas..." : "Buscar modelos..."}
/>


            </Col>
            <p></p>
            <Col xs={12} className="d-flex justify-content-end ">

            <Nav.Link className="text-dark ms-2" onClick={(e) => { e.preventDefault(); handleOpenModal(); }}>
                <i className="bi bi-plus-circle fs-2"></i>
              </Nav.Link>
              </Col>

          </Row>
          {activeTab === "/home" && (
            <TablaMarcas
              marcas={marcas}
              searchTerm={searchTermMarcas}
              setSearchTerm={setSearchTermMarcas}
              currentPage={currentPageMarcas}
              setCurrentPage={setCurrentPageMarcas}
              recordsPerPage={recordsPerPageMarcas}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              


            />
          )}
          {activeTab === "link-1" && (
            <TablaModelos
              modelos={modelosReales}
              searchTerm={searchTermModelos}
              setSearchTerm={setSearchTermModelos}
              currentPage={currentPageModelos}
              setCurrentPage={setCurrentPageModelos}
              recordsPerPage={recordsPerPageModelos}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </Card>
      </Container>
      {/* Modal para Marcas */}
      <Modal show={showMarcasModal} onHide={() => setShowMarcasModal(false)} centered>
        <StyledModalContent>
          <Modal.Header closeButton>
            <Modal.Title className="title">Agregar Marca</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => {
              e.preventDefault();
              const nombre = e.target.nombre.value;
              if (validateFields({ nombre }, true)) {
                agregarMarca({ nombre, estado: 'ACTIVO' });
              }
            }}>
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
            modelo: e.target.modelo.value,
            marca: e.target.marca.value,
            placa: e.target.placa.value,
            precio: e.target.precio.value,
            año: e.target.año.value,
            color: e.target.color.value,
            descripcion: e.target.descripcion.value,
            imagen: e.target.imagen.files[0] || null,
          };
          if (validateFields(data, false)) {
            agregarModelo({ ...data, estado: 'Activo' });
          }
        }}
      >
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control type="text" name="modelo" className="input" isInvalid={!!errors.modelo} />
              <Form.Control.Feedback type="invalid">{errors.modelo}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control type="text" name="marca" className="input" isInvalid={!!errors.marca} />
              <Form.Control.Feedback type="invalid">{errors.marca}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Placa</Form.Label>
              <Form.Control type="text" name="placa" className="input" isInvalid={!!errors.placa} />
              <Form.Control.Feedback type="invalid">{errors.placa}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="text" name="precio" className="input" isInvalid={!!errors.precio} />
              <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>
              <Form.Control type="text" name="año" className="input" isInvalid={!!errors.año} />
              <Form.Control.Feedback type="invalid">{errors.año}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <Form.Control type="text" name="color" className="input" isInvalid={!!errors.color} />
              <Form.Control.Feedback type="invalid">{errors.color}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" name="descripcion" className="input" isInvalid={!!errors.descripcion} />
              <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" name="imagen" accept="image/*" />
            </Form.Group>
          </Col>
        </Row>
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
            <Modal.Title className="title">
              Editar {selectedItem?.isMarca ? selectedItem?.nombre : selectedItem?.modelo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {selectedItem?.isMarca ? (
                <>
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
                </>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Modelo</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.modelo}
                      onChange={(e) => setEditedData({ ...editedData, modelo: e.target.value })}
                      className="input"
                      isInvalid={!!errors.modelo}
                    />
                    <Form.Control.Feedback type="invalid">{errors.modelo}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Marca</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.marca}
                      onChange={(e) => setEditedData({ ...editedData, marca: e.target.value })}
                      className="input"
                      isInvalid={!!errors.marca}
                    />
                    <Form.Control.Feedback type="invalid">{errors.marca}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.placa}
                      onChange={(e) => setEditedData({ ...editedData, placa: e.target.value })}
                      className="input"
                      isInvalid={!!errors.placa}
                    />
                    <Form.Control.Feedback type="invalid">{errors.placa}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.precio}
                      onChange={(e) => setEditedData({ ...editedData, precio: e.target.value })}
                      className="input"
                      isInvalid={!!errors.precio}
                    />
                    <Form.Control.Feedback type="invalid">{errors.precio}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Año</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.año}
                      onChange={(e) => setEditedData({ ...editedData, año: e.target.value })}
                      className="input"
                      isInvalid={!!errors.año}
                    />
                    <Form.Control.Feedback type="invalid">{errors.año}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.color}
                      onChange={(e) => setEditedData({ ...editedData, color: e.target.value })}
                      className="input"
                      isInvalid={!!errors.color}
                    />
                    <Form.Control.Feedback type="invalid">{errors.color}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={editedData.descripcion}
                      onChange={(e) => setEditedData({ ...editedData, descripcion: e.target.value })}
                      className="input"
                      isInvalid={!!errors.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
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
                  <option value="Activo">Activo</option>
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
    </>
  );
}

export default GerenteMarcaModelo;
