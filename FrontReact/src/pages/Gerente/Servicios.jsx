import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { BsPencilSquare, BsToggleOn, BsToggleOff } from "react-icons/bs";
import Swal from 'sweetalert2';
import BootstrapPagination from '../../components/common/BootstrapPagination';
import { createGlobalStyle } from "styled-components";
import FiltroBuscador from '../../components/Filtros/FiltroBuscador';
import axios from "axios";
import { getServicios, addServicio, updateServicio, toggleEstadoServicio, deleteServicio } from '../../services/GerenteService/ServiciosService';

const CustomTableHeader = styled.thead`
  background-color: #018180;
  color: white;

  th {
    background-color: #018180;
    color: white;
    text-align: center;
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

  const [nomGenerada,setNomGenerada] = useState("")

  function generateNomenclature(name) {
    const words = name.trim().split(/\s+/);
    let nomenclature = "";
    let nomenclatureF = "";

    
    if (words.length === 1) {
        nomenclature = words[0].slice(0, 4);
    } else if (words.length === 2) {
        nomenclature = words[0].slice(0, 2) + words[1].slice(0, 2);
    } else if (words.length === 3) {
        nomenclature = words[0][0] + words[1][0] + words[2].slice(0, 2);
    } else {
        nomenclature = words.map(word => word[0]).join("");
    }
    
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatorios
    nomenclatureF = nomenclature.toUpperCase() + "-" + randomNumbers
    setNomGenerada(nomenclatureF)
    return nomenclatureF;
}




  const [showservicioModal, setShowservicioModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [modalidades, setModalidades] = useState([]);

  const [editedData, setEditedData] = useState({
    nomenclatura: '',
    name: '',
    price: '',
    description: '',
    modalidad: modalidades.length > 0 ? modalidades[0] : {}, // Primer modalidad seleccionada por defecto
    estate: true,
  });

  const [serviciosReales, setServiciosReales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("https://bwubka276h.execute-api.us-east-1.amazonaws.com/servicios/obtener", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setServiciosReales(response.data);
          setFilteredServicios(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("No se encontró el token");
      setLoading(false);
    }
  }, []);

  const [filteredServicios, setFilteredServicios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalPages = Math.ceil(filteredServicios.length / recordsPerPage);
  const currentServicios = filteredServicios.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleSearch = (searchTerm) => {
    const filtered = serviciosReales.filter((servicio) => {
      return Object.values(servicio).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredServicios(filtered);
    setCurrentPage(1);
  };

  const paginate = (page) => {
    if (page === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (servicio) => {
    setSelectedItem(servicio);
    setEditedData({
      nomenclatura: servicio.nomenclatura,
      name: servicio.name,
      price: servicio.price,
      description: servicio.description,
      modalidad: servicio.modalidad,
      estate: servicio.estate,
    });
    setEditModal(true);
  };

  const clearModalData = () => {
    setEditedData({
      nomenclatura: '',
      name: '', 
      price: '',
      description: '',
      modalidad: "", // Primer modalidad seleccionada por defecto
      estate: true,
    });
  };
  

  const validateFields = () => {
    const { nomenclatura, name, price, description } = editedData;
    if (!nomenclatura.trim() || !name.trim() || !price.trim() || !description.trim()) {
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
    if (nomenclatura.trim().length < 3) {
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
    if (name.trim().length < 3) {
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
    if (isNaN(price)) {
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
    if (Number(price) <= 0) {
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

  const handleSaveChanges = () => {
    if (!selectedItem || !selectedItem.id) {
      console.error('El ID no está presente');
      Swal.fire({
        title: "Error",
        text: "No se encontró el ID del servicio.",
        icon: "error",
        confirmButtonColor: "#dc3545",
        customClass: { confirmButton: "btn-swal-cancelar" },
      });
      return;
    }

    const updatedServicio = {
      id: selectedItem.id,
      nomenclatura: editedData.nomenclatura,
      name: editedData.name,
      price: editedData.price,
      description: editedData.description,
      modalidad: editedData.modalidad,
      estate: editedData.estate,
    };

    updateServicio(selectedItem.id, updatedServicio, localStorage.getItem('token'),nomGenerada)
      .then(() => {
        const updatedServicios = serviciosReales.map((servicio) =>
          servicio.id === selectedItem.id ? updatedServicio : servicio
        );
        setServiciosReales(updatedServicios);
        setFilteredServicios(updatedServicios);
        setEditModal(false);

        Swal.fire({
          title: "¡Guardado!",
          text: "Los cambios han sido guardados con éxito.",
          icon: "success",
          confirmButtonColor: "#018180",
          customClass: { confirmButton: 'btn-swal-confirmar' },
        }).then(() => {
          setShowservicioModal(false);
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el servicio:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al actualizar el servicio.",
          icon: "error",
          confirmButtonColor: "#dc3545",
          customClass: { confirmButton: "btn-swal-cancelar" },
        });
      });
  };

  const agregarservicio = (nuevoServicio) => {
    console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(nuevoServicio)
    nuevoServicio.nomenclatura = nomGenerada
    if (validateFields()) {
      axios.post('https://bwubka276h.execute-api.us-east-1.amazonaws.com/servicios/crear', nuevoServicio, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          setServiciosReales((prevServicios) => [...prevServicios, response.data]);
          setFilteredServicios((prevServicios) => [...prevServicios, response.data]);
          setShowservicioModal(false);
          clearModalData();

          Swal.fire({
            title: "¡Agregado!",
            text: "El servicio ha sido agregado con éxitooooo.",
            icon: "success",
            confirmButtonColor: "#018180",
            customClass: { confirmButton: "btn-swal-confirmar" },
          });
        })
        .catch((error) => {
          console.error("Error al agregar servicio:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo agregar el servicio.",
            icon: "error",
            confirmButtonColor: "#dc3545",
            customClass: { confirmButton: "btn-swal-cancelar" },
          });
        });
    }
  };

  const closeModal = () => {
    setShowservicioModal(false);
    setEditModal(false);
    clearModalData();
  };

  const handleToggleStatus = (servicio) => {
    const newState = servicio.estate === true ? false : true; // Cambia el estado (de true a false o de false a true)

    Swal.fire({
        title: `¿Estás seguro de ${newState ? 'activar' : 'desactivar'} a ${servicio.name}?`,
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
            // Enviar solicitud PUT para actualizar el estado en el backend
            axios.put(`https://bwubka276h.execute-api.us-east-1.amazonaws.com/servicios/estado/${servicio.id}`, { estate: newState }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                // Si la actualización es exitosa, actualizamos el estado local
                const updatedServicio = { ...servicio, estate: newState };

                const updatedServicios = serviciosReales.map((s) =>
                    s.id === servicio.id ? updatedServicio : s
                );
                setServiciosReales(updatedServicios);
                setFilteredServicios(updatedServicios); // Actualiza la lista filtrada

                Swal.fire({
                    title: "¡Hecho!",
                    text: `El estado de ${servicio.name} ha sido cambiado.`,
                    icon: "success",
                    customClass: {
                        popup: 'swal2-popup',
                        confirmButton: 'btn-swal-confirmar',
                    },
                    buttonsStyling: false,
                });
            })
            .catch((error) => {
                console.error("Error al cambiar el estado del servicio:", error);
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al cambiar el estado del servicio.",
                    icon: "error",
                    confirmButtonColor: "#dc3545",
                    customClass: { confirmButton: "btn-swal-cancelar" },
                });
            });
        }
    });
};



  useEffect(() => {
    console.log("get the useEffect")
    const token = localStorage.getItem('token');  // Obtener el token del localStorage
    console.log("token: " + token)

    if (token) {
      axios.get('https://bwubka276h.execute-api.us-east-1.amazonaws.com/modali/get', {
        headers: {
          Authorization: `Bearer ${token}`  // Usar el token en el encabezado

        }
      })
        .then(response => {
          setModalidades(response.data);

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
      <div
          style={{
            color: '#018180',
            padding: '12px 25px',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            display: 'inline-block',
            marginBottom: '20px',
          }}
        >
          Servicios
        </div>
        <Card>
          <Row className="mb-3">
            
          </Row>
          <Row className="mb-1">
            <Col>
              <Nav variant="tabs" defaultActiveKey="/servicios">
                
              <FiltroBuscador onSearch={handleSearch} placeholder="Buscar servicio..." />

                <Nav.Link
                  className="text-dark ms-auto"
                  onClick={(e) => {
                    e.preventDefault();
                    clearModalData(); // Limpiar los datos antes de abrir el modal
                    setShowservicioModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle fs-2"></i>
                </Nav.Link>
              </Nav>
            </Col>
          </Row>

          <Modal show={showservicioModal || editModal} onHide={closeModal} centered>
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
                      value={editedData.nomenclatura}
                      onChange={(e) => setEditedData({ ...editedData, nomenclatura: e.target.value })}
                      className="input"
                      required
                      placeholder={nomGenerada}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nombre servicio</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.name}
                      onChange={(e) => {setEditedData({ ...editedData, name: e.target.value },generateNomenclature(editedData.name))}}
                      className="input"
                      required

                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={editedData.description}
                      onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                      className="input"
                      required
                      rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedData.price}
                      onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                      className="input"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Periodo</Form.Label>
                    <Form.Select
                      value={editedData.modalidad ? JSON.stringify(editedData.modalidad) : "default"} // Convierte el objeto modalidad_id a cadena JSON
                      onChange={(e) => {
                        if (e.target.value !== "default") {
                          setEditedData({ ...editedData, modalidad: JSON.parse(e.target.value) });
                        }
                      }}
                      className="input"
                      required
                    >
                      <option value="default">Selecciona una modalidad para el servicio</option>
                      {modalidades.map((modalidad) => (
                        <option key={modalidad.id} value={JSON.stringify(modalidad)}>
                          {modalidad.nombre}
                        </option>
                      ))}
                    </Form.Select>

                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button className="submit btn btn-primary" variant="secondary" onClick={closeModal}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={editModal ? handleSaveChanges : () => agregarservicio(editedData)} className="submit">
                  {editModal ? "Guardar cambios" : "Agregar"}
                </Button>
              </Modal.Footer>
            </StyledWrapper>
          </Modal>

          <StyledWrapper>
            <div className="scrollable-table">
              <Table striped  hover className="mt-2">
                <CustomTableHeader>
                  <tr>
                    <th>Identificador</th>
                    <th>Nombre de Servicio</th>
                    <th>Precio</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </CustomTableHeader>
                <tbody>
                  {currentServicios.map((servicio) => (
                    <tr key={servicio.id}>
                      <td>{servicio.nomenclatura}</td>
                      <td>{servicio.name}</td>
                      <td>$ {servicio.price}</td>
                      <td>{servicio.description}</td>
                      <td>{servicio.estate ? "Activo" : "Desactivado"}</td>
                      <td>
                        <BsPencilSquare
                          className="text-primary me-5 fs-2"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEdit(servicio)}
                        />
                        {servicio.estate === true ? (
                          <BsToggleOn
                            className="text-success fs-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggleStatus(servicio)}  // Cambiar el estado cuando se hace click
                          />
                        ) : (
                          <BsToggleOff
                            className="text-danger fs-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleToggleStatus(servicio)}  // Cambiar el estado cuando se hace click
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
                onPageChange={paginate}
              />
            </div>
          </StyledWrapper>
        </Card>
      </Container>
    </>
  );
}