import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const FormRegistro = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        lastName: "",
        secondLastName: "",
        phone: "",
        email: ""
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        Swal.fire({
            title: "Registro Exitoso",
            text: "Le hemos enviado un correo con su contraseña.",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            setFormData({
                firstName: "",
                secondName: "",
                lastName: "",
                secondLastName: "",
                phone: "",
                email: ""
            });
        });
    };

    return (
        <div className="p-3 shadow-sm" style={{ maxWidth: "400px", margin: "50px auto" }}>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex gap-2">
                    <Form.Group className="mb-1 w-50">
                        <Form.Label htmlFor="firstName" className="small">Primer Nombre</Form.Label>
                        <Form.Control type="text" id="firstName" placeholder="Primer Nombre" required size="sm" value={formData.firstName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-1 w-50">
                        <Form.Label htmlFor="secondName" className="small">Segundo Nombre</Form.Label>
                        <Form.Control type="text" id="secondName" placeholder="Segundo Nombre" size="sm" value={formData.secondName} onChange={handleChange} />
                    </Form.Group>
                </div>
                <div className="d-flex gap-2">
                    <Form.Group className="mb-1 w-50">
                        <Form.Label htmlFor="lastName" className="small">Primer Apellido</Form.Label>
                        <Form.Control type="text" id="lastName" placeholder="Primer Apellido" required size="sm" value={formData.lastName} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-1 w-50">
                        <Form.Label htmlFor="secondLastName" className="small">Segundo Apellido</Form.Label>
                        <Form.Control type="text" id="secondLastName" placeholder="Segundo Apellido" size="sm" value={formData.secondLastName} onChange={handleChange} />
                    </Form.Group>
                </div>
                <Form.Group className="mb-1">
                    <Form.Label htmlFor="phone" className="small">Teléfono</Form.Label>
                    <Form.Control type="text" id="phone" placeholder="Teléfono" required size="sm" className="form-control" value={formData.phone} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-1">
                    <Form.Label htmlFor="email" className="small">Correo</Form.Label>
                    <Form.Control type="email" id="email" placeholder="Correo" required size="sm" className="form-control" value={formData.email} onChange={handleChange} />
                </Form.Group>
                <Button variant="success" type="submit" size="sm" className="w-100 mt-2">
                    Registrar
                </Button>
            </Form>
        </div>
    );
};

export default FormRegistro;
