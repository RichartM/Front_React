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
  const [selectedMarca, setSelectedMarca] = useState(null);

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

  const [marcasApi, setMarcasApi] = useState([])

  const [estadosAuto, setEstadosAuto] = useState([])

  let selectedMarcalol = "" //checa 593


  //tipos de estados del auto

  useEffect(() => {
    console.log("get the useEffect")
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    console.log("token: " + token)


    axios.get('http://localhost:8080/modalidad/todos', {

    })
      .then(response => {
        setEstadosAuto(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });

  }, []);

  //obtener las marcas

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      axios.get('http://localhost:8080/marcas/getAll', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(response => {
          setMarcasApi(response.data);
        })
        .catch(error => {
          console.error('Error al obtener las marcas:', error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al obtener las marcas.",
            icon: "error",
            confirmButtonColor: "#dc3545",
            customClass: { confirmButton: 'btn-swal-cancelar' },
            buttonsStyling: false,
          });
        });
    }
  }, []);





  const handleOpenModal = () => {
    if (activeTab === "/home") {
      setShowMarcasModal(true);
    } else if (activeTab === "link-1") {
      setShowModelosModal(true);
    }
  };

  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };


  // Funciones para agregar registros

  const agregarModelo = async (nuevoModelo) => {
    if (!selectedMarca || typeof selectedMarca !== 'object' || !selectedMarca.nombre) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar una marca válida.",
        icon: "error",
        confirmButtonColor: "#dc3545",
        customClass: { confirmButton: 'btn-swal-cancelar' },
        buttonsStyling: false,
      });
      return; // Detener la ejecución si no hay una marca válida
    }

    nuevoModelo.estadoVehiculo = true; // Esto asegura que el estado siempre esté como 'Activo'

    if (nuevoModelo.imagen) {
      try {
        const imgBase64 = await convertirABase64(nuevoModelo.imagen); // Esperamos la conversión
        nuevoModelo.imagen = imgBase64; // Asignamos la imagen ya convertida
      } catch (error) {
        console.error("Error al convertir la imagen a Base64:", error);
        return;
      }
    }

    nuevoModelo.marca = selectedMarca; // Usar el estado selectedMarca
    nuevoModelo.estado = { id: 1, nombre: "Disponible" };

    axios.post('http://localhost:8080/vehiculo/crear', nuevoModelo, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setModelosREales(prevModelos => [...prevModelos, response.data]);

        Swal.fire({
          title: "¡Agregado!",
          text: "El modelo ha sido agregado con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: "btn-swal-confirmar" },
          buttonsStyling: false,
        }).then(() => {
          setShowModelosModal(false); // Cierra el modal
          setSelectedMarca(null); // Limpiar la selección de marca
        });
      })
      .catch(error => {
        console.error("Error al agregar el modelo:", error);
      });
  };

  const agregarMarca = (nuevaMarca) => {
    //const newMarca = { ...nuevaMarca, id: marcas.length + 1 };
    //setMarcas([...marcas, newMarca]);
    //setShowMarcasModal(false);
    console.log("nueva marca: " + nuevaMarca.nombre)
    axios.post('http://localhost:8080/marcas/post', nuevaMarca, {
      headers: {
        Authorization: `Bearer  ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log("Respuesta del backend:", response.data); // Verifica qué devuelve la API

        // Agregar la nueva marca al estado
        setMarcasApi(prevMarcas => [...prevMarcas, response.data]);

        Swal.fire({
          title: "¡Agregado!",
          text: "La marca ha sido agregada con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false
        }).then(() => {
          setShowMarcasModal(false);
        });
      })
      .catch(error => {
        console.error('Error al agregar la marca:', error);
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
        marca: item.marca, // Asegúrate de que esto sea un objeto { id, nombre }
        matricula: item.matricula,
        precio: item.precio,
        year: item.year,
        color: item.color,
        description: item.description,
        // No incluir estadoVehiculo aquí
      });
    }
    setEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (validateFields(editedData, selectedItem.isMarca)) {
      try {
        if (selectedItem.isMarca) {
          // Lógica para actualizar marca
          setMarcas(marcas.map(m => m.id === selectedItem.id ? { ...m, ...editedData } : m));
        } else {
          // Lógica para actualizar modelo
          const response = await axios.put(
            `http://localhost:8080/vehiculo/actualizar/${selectedItem.id}`,
            editedData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            }
          );

          const updatedItem = response.data;

          // Actualizar el estado local
          setModelosREales(prevModelos =>
            prevModelos.map(modelo =>
              modelo.id === updatedItem.id ? { ...modelo, ...updatedItem } : modelo
            )
          );
        }

        setEditModal(false);
        Swal.fire({
          title: "¡Guardado!",
          text: "Los cambios han sido guardados con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false,
        });
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar los cambios.",
          icon: "error",
          confirmButtonColor: "#dc3545",
          customClass: { confirmButton: 'btn-swal-cancelar' },
          buttonsStyling: false,
        });
      }
    }
  };


  //Para MARCAS
  const handleSaveMarcaChanges = async () => {
    if (validateFields(editedData, true)) { // Asegúrate de que esté validado
      try {
        // Lógica para actualizar la marca (solo el nombre, no se toca el estado)
        const updatedMarca = { 
          nombre: editedData.nombre,
          estado: selectedItem.estado // Mantén el estado original tal como está
        };
  
        // Realizar el PUT para actualizar la marca
        const response = await axios.put(
          `http://localhost:8080/marcas/put/${selectedItem.id}`,
          updatedMarca,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        // Actualizar el estado local con la marca actualizada
        setMarcasApi(prevMarcas =>
          prevMarcas.map(marca =>
            marca.id === selectedItem.id ? response.data : marca
          )
        );
  
        // Cierra el modal de edición
        setEditModal(false);
  
        // Muestra un mensaje de éxito
        Swal.fire({
          title: "¡Guardado!",
          text: "Los cambios han sido guardados con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
          buttonsStyling: false,
        });
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al guardar los cambios.",
          icon: "error",
          confirmButtonColor: "#dc3545",
          customClass: { confirmButton: 'btn-swal-cancelar' },
          buttonsStyling: false,
        });
      }
    }
  };
  



  const handleToggleStatus = async (marca, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/marcas/editEstado/${marca.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la marca');
      }
  
      const updatedMarca = await response.json();
  
      // Actualiza el estado de la marca en el frontend
      setMarcasApi((prevMarcas) =>
        prevMarcas.map((m) =>
          m.id === updatedMarca.id ? { ...m, estado: updatedMarca.estado } : m
        )
      );
  
      // Muestra una alerta de éxito
      Swal.fire({
        title: "¡Estado actualizado!",
        text: `El estado de la marca "${marca.nombre}" ha sido cambiado a ${newStatus ? "Activo" : "Inactivo"}.`,
        icon: "success",
        confirmButtonColor: "#018180", // Color del botón de confirmación
        customClass: { confirmButton: 'btn-swal-confirmar' }, // Clase personalizada
        buttonsStyling: false, // Desactiva el estilo por defecto de SweetAlert2
      });
    } catch (error) {
      console.error('Error:', error);
  
      // Muestra una alerta de error
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al cambiar el estado de la marca.",
        icon: "error",
        confirmButtonColor: "#dc3545", // Color del botón de error
        customClass: { confirmButton: 'btn-swal-cancelar' }, // Clase personalizada
        buttonsStyling: false, // Desactiva el estilo por defecto de SweetAlert2
      });
    }
  };
  // Validación de campos (para marca y para modelo)
  const validateFields = (data, isMarca) => {
    const newErrors = {};
    if (isMarca) {
      if (!data.nombre || !data.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    } else {
      if (!data.modelo || !data.modelo.trim()) newErrors.modelo = "El modelo es obligatorio.";
      if (!data.marca || typeof data.marca !== 'object' || !data.marca.nombre) {
        newErrors.marca = "La marca es obligatoria.";
      }
      if (!data.matricula || !data.matricula.trim()) newErrors.placa = "La placa es obligatoria.";
      if (!data.precio || !data.precio.toString().trim()) newErrors.precio = "El precio es obligatorio.";
      if (!data.year || !data.year.toString().trim()) newErrors.año = "El año es obligatorio.";
      if (!data.color || !data.color.trim()) newErrors.color = "El color es obligatorio.";
      if (!data.description || !data.description.trim()) newErrors.descripcion = "La descripción es obligatoria.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  ///OBTENIENDO LAS MARCAS DE LA BASE DE DARTO
  const [marcasReales, setMarcasREales] = useState([])

  useEffect(() => {
    console.log("get the useEffect")
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    console.log("token: " + token)

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
  const [modelosReales, setModelosREales] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      axios.get('http://localhost:8080/vehiculo/obtener', {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en el header
        },
      })
        .then(response => {
          setModelosREales(response.data);
        })
        .catch(error => {
          console.error('Error al obtener los modelos:', error);
        });
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
              marcas={marcasApi}
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
              setModelos={setModelosREales}  // Pasando correctamente la función setModelosREales
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
                agregarMarca({ nombre: nombre, estado: true }); //antes:                agregarMarca({ nombre, estado: 'ACTIVO' });

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
                  marca: selectedMarca, // Usa el estado selectedMarca directamente
                  matricula: e.target.matricula.value,
                  precio: e.target.precio.value,
                  year: e.target.year.value,
                  color: e.target.color.value,
                  description: e.target.description.value,
                  imagen: e.target.imagen.files[0] || null,
                };
                if (validateFields(data, false)) {
                  agregarModelo({ ...data, estado: 'Activo' });
                }
              }}
            >
              {/* Campos del formulario */}
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
                    <Form.Select
                      value={selectedMarca ? JSON.stringify(selectedMarca) : ""}
                      onChange={(e) => {
                        const selectedMarca = JSON.parse(e.target.value); // Convierte el valor seleccionado a objeto
                        setSelectedMarca(selectedMarca); // Actualiza el estado
                      }}
                      className="input"
                      isInvalid={!!errors.marca}
                    >
                      <option value="">Selecciona una marca</option>
                      {marcasApi.map((marca, index) => (
                        <option key={index} value={JSON.stringify(marca)}>
                          {marca.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.marca}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control type="text" name="matricula" className="input" isInvalid={!!errors.placa} />
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
                    <Form.Control type="text" name="year" className="input" isInvalid={!!errors.año} />
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
                    <Form.Control as="textarea" name="description" className="input" isInvalid={!!errors.descripcion} />
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
              Editar {selectedItem?.nombre} {/* Muestra el nombre de la marca aquí */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => e.preventDefault()}>  {/* Prevenir envío del formulario */}
              {selectedItem?.isMarca && (  // Solo mostrar si es una marca
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre de Marca</Form.Label>
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
              )}
              {selectedItem?.isMarca === false && (  // Solo mostrar si es un modelo
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
                    <Form.Select
                      value={editedData.marca ? JSON.stringify(editedData.marca) : ""}
                      onChange={(e) => {
                        const selectedMarca = JSON.parse(e.target.value); // Convertir la cadena de vuelta a objeto
                        setEditedData({ ...editedData, marca: selectedMarca });
                      }}
                      className="input"
                      isInvalid={!!errors.marca}
                    >
                      <option value="">Selecciona una marca</option>
                      {marcasApi.map((marca, index) => (
                        <option key={index} value={JSON.stringify(marca)}>
                          {marca.nombre}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.marca}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={editedData.estado}
                      onChange={(e) => setEditedData({ ...editedData, estado: e.target.value })}
                      className="input"
                      isInvalid={!!errors.estado}
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.estado}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Placa</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.matricula}
                      onChange={(e) => setEditedData({ ...editedData, matricula: e.target.value })}
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
                      value={editedData.year}
                      onChange={(e) => setEditedData({ ...editedData, year: e.target.value })}
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
                      value={editedData.description}
                      onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                      className="input"
                      isInvalid={!!errors.descripcion}
                    />
                    <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton variant="secondary" onClick={() => { setEditModal(false); setErrors({}); }}>
              Cancelar
            </CustomButton>
            <CustomButton
              variant="primary"
              onClick={() => {
                if (selectedItem?.isMarca) {
                  handleSaveMarcaChanges(); // Si es una marca
                } else {
                  handleSaveChanges(); // Si es un vehículo
                }
              }}
            >
              Guardar cambios
            </CustomButton>
          </Modal.Footer>
        </StyledModalContent>
      </Modal>


    </>
  );
}

export default GerenteMarcaModelo;
