import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Container, Spinner, Button, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import axios from "axios";

const StyledContainer = styled(Container)`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  &:hover {
    background-color: #016a6a !important;
  }
`;

const EditPerfilAgente = () => {
  const [perfil, setPerfil] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar el perfil al montar
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Asumiendo que guardas el token así
        const response = await axios.get("http://localhost:8080/api/auth/perfilAgente", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPerfil(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el perfil.",
          icon: "error",
          confirmButtonColor: "#018180",
        });
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordStrength(zxcvbn(e.target.value).score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Check if current password is provided
    if (!currentPassword) {
      Swal.fire({
        title: "Error",
        text: "Debes ingresar tu contraseña actual para actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
      setIsSubmitting(false);
      return;
    }
  
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
      setIsSubmitting(false);
      return;
    }
  
    // Prepare data to send
    const updatedData = {
      name: perfil.name,
      lastname: perfil.lastname,
      surname: perfil.surname,
      username: perfil.username,
      email: perfil.email,
      currentPassword: currentPassword,
      newPassword: newPassword || undefined, // optional
    };
  
    try {
      const response = await axios.put("http://localhost:8080/api/auth/perfilAgente", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      Swal.fire({
        title: "¡Perfil actualizado!",
        text: response.data.message || "Los datos fueron actualizados correctamente.",
        icon: "success",
        confirmButtonColor: "#018180",
      });
    } catch (error) {
      console.error("❌ Error al actualizar el perfil:", error);
  
      // Handle token expiry
      if (error.response?.status === 401) {
        Swal.fire({
          title: "Sesión expirada",
          text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
          icon: "warning",
          confirmButtonColor: "#018180",
        }).then(() => {
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect to login page
        });
        return;
      }
  
      // Handle other errors
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Hubo un problema al actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StyledContainer className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando perfil...</p>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer style={{ marginTop: "30%" }}>
      <h2 className="text-center" style={{ color: "#018180" }}>
        Editar Perfil ({perfil.rol})
      </h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="name">Nombre</Form.Label>
          <Form.Control type="text" id="name" name="name" value={perfil.name || ""} onChange={handleChange} required autoComplete="name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="lastname">Apellido</Form.Label>
          <Form.Control type="text" id="lastname" name="lastname" value={perfil.lastname || ""} onChange={handleChange} required autoComplete="family-name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="surname">Segundo Apellido</Form.Label>
          <Form.Control type="text" id="surname" name="surname" value={perfil.surname || ""} onChange={handleChange} autoComplete="additional-name" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control type="text" id="username" name="username" value={perfil.username || ""} onChange={handleChange} required autoComplete="username" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control type="email" id="email" name="email" value={perfil.email || ""} onChange={handleChange} required autoComplete="email" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="currentPassword">Contraseña Actual</Form.Label>
          <Form.Control
            type="password"
            id="currentPassword"
            placeholder="Ingrese su contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="newPassword">Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            id="newPassword"
            placeholder="Nueva contraseña (opcional)"
            value={newPassword}
            onChange={handlePasswordChange}
            autoComplete="new-password"
          />
          {newPassword && (
            <ProgressBar
              now={passwordStrength * 25}
              variant={passwordStrength === 0 ? "danger" : passwordStrength === 1 ? "warning" : passwordStrength === 2 ? "info" : "success"}
              className="mt-2"
            />
          )}
          <p className="mt-1 text-muted">
            Nivel de seguridad: {["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][passwordStrength]}
          </p>
        </Form.Group>

        <StyledButton type="submit" className="w-100 mt-3" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Confirmar Cambios"}
        </StyledButton>
      </Form>
    </StyledContainer>
  );
};

export default EditPerfilAgente;