import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Container } from "react-bootstrap";
import AuthServiceProfile from "../../services/AuthServiceProfile";
import AuthServiceLogin from "../../services/AuthServiceLogin";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)`
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const EditPerfil = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState("");
    const [error, setError] = useState(null); // ✅ Agrega estado para manejar errores

    useEffect(() => {
        // Si el token ha expirado, redirigir al login
        if (AuthServiceLogin.isTokenExpired()) {
            console.warn("Token expirado. Redirigiendo al login...");
            AuthServiceLogin.logout();
            return;
        }

        const loadUserProfile = async () => {
            try {
                const userData = await AuthServiceProfile.getUserProfile();
                setNombre(userData.name || "");
                setApellido(userData.lastname || "");
                setEmail(userData.email || "");
                setRol(AuthServiceLogin.getRoleFromToken());
            } catch (error) {
                console.error("Error al cargar perfil:", error);
                setError("No se pudo cargar el perfil. Intenta nuevamente.");
            }
        };

        loadUserProfile();
    }, []);

    // Si hay un error, mostrar mensaje en vez de cerrar sesión directamente
    if (error) {
        return (
            <StyledContainer>
                <h2 className="text-center mb-4">Editar Perfil</h2>
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <h2 className="text-center mb-4">Editar Perfil ({rol})</h2>
            <Form>
                <Form.Group className="mb-3" controlId="nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" value={nombre} disabled />
                </Form.Group>
                <Form.Group className="mb-3" controlId="apellido">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control type="text" value={apellido} disabled />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} disabled />
                </Form.Group>
            </Form>
        </StyledContainer>
    );
};

export default EditPerfil;
