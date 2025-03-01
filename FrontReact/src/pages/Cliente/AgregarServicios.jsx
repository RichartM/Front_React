  import React, { useState } from "react";
  import { Modal, Form, Button } from "react-bootstrap";

  const AgregarServicios = ({ agregarServicio, cerrarModal }) => {
    const [nuevoServicio, setNuevoServicio] = useState({
      id: Math.floor(Math.random() * 1000),
      nombre: "",
      precio: "",
      tipo: "Mensual",
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (nuevoServicio.nombre && nuevoServicio.precio) {
        agregarServicio(nuevoServicio);
        cerrarModal();
      }
    };

    return (
      <>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre del Servicio</Form.Label>
              <Form.Control type="text" required onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precio</Form.Label>
              <Form.Control type="number" required onChange={(e) => setNuevoServicio({ ...nuevoServicio, precio: `$${e.target.value}` })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipo de Servicio</Form.Label>
              <Form.Select onChange={(e) => setNuevoServicio({ ...nuevoServicio, tipo: e.target.value })}>
                <option value="Mensual">Mensual</option>
                <option value="Anual">Anual</option>
                <option value="Única Ocasión">Única Ocasión</option>
              </Form.Select>
            </Form.Group>
            <Button className="mt-3" variant="primary" type="submit">
              Agregar
            </Button>
          </Form>
        </Modal.Body>
      </>
    );
  };

  export default AgregarServicios;
