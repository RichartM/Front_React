import React, { useState, useEffect } from "react";
import { usePerfilCliente } from "../../context/PerfilClienteContext";
import styled from "styled-components";
import { Form, Container, Spinner, Button, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import AuthServiceProfile from "../../services/AuthServiceProfile";

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

const EditPerfilCliente = () => {
  const [perfil, setPerfil] = useState({}); // Declara el estado y su función de actualización
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePerfil } = usePerfilCliente();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await AuthServiceProfile.getUserProfile();
        setPerfil(userData); // Actualiza el estado con los datos del perfil
        setLoading(false);
      } catch (error) {
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
    setPerfil({ ...perfil, [e.target.name]: e.target.value }); // Usa setPerfil para actualizar el estado
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordStrength(zxcvbn(e.target.value).score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    const updatedData = { ...perfil, currentPassword, newPassword };

    try {
      const response = await AuthServiceProfile.updateUserProfile(updatedData);

      if (response && response.message) {
        Swal.fire({
          title: "Éxito",
          text: response.message,
          icon: "success",
          confirmButtonColor: "#018180",
        });

        await updatePerfil(); // Actualiza el contexto
      } else {
        throw new Error("Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      const errorMessage = error.response?.data?.message || error.message || "Hubo un problema al actualizar el perfil.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
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
      <h2 className="text-center" style={{ color: "#018180" }}>Editar Perfil ({perfil.rol})</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" name="name" value={perfil.name || ""} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" name="lastname" value={perfil.lastname || ""} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Segundo Apellido</Form.Label>
          <Form.Control type="text" name="surname" value={perfil.surname || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={perfil.username || ""} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={perfil.email || ""} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña Actual</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingrese su contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nueva contraseña (opcional)"
            value={newPassword}
            onChange={handlePasswordChange}
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

export default EditPerfilCliente;