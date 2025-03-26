import React, { useState, useEffect } from "react";
import { usePerfilAgente } from "../../context/PerfilAgenteContext";
import styled from "styled-components";
import { Form, Container, Spinner, Button, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import AuthServiceAgente from "../../services/AgenteService/AuthServiceAgente";

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
  const { perfil: perfilContext, updatePerfil } = usePerfilAgente();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await AuthServiceAgente.getUserProfile();
        setPerfil(data);
      } catch (error) {
        console.error("❌ Error al cargar el perfil del agente:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo cargar el perfil.",
          icon: "error",
          confirmButtonColor: "#018180",
        });
      } finally {
        setLoading(false);
      }
    };
    

    loadUserProfile();
  }, []);

  useEffect(() => {
    if (perfilContext) setPerfil(perfilContext);
  }, [perfilContext]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordStrength(zxcvbn(e.target.value).score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      return Swal.fire({
        title: "Error",
        text: "Debes ingresar tu contraseña actual para actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
    }

    try {
      await AuthServiceAgente.updateUserProfile({
        name: perfil.name,
        lastname: perfil.lastname,
        surname: perfil.surname,
        email: perfil.email,
        currentPassword,
        ...(newPassword && { newPassword }),
      });
      

      await updatePerfil();
      setCurrentPassword("");
      setNewPassword("");

      Swal.fire({
        title: "Éxito",
        text: "Perfil actualizado correctamente",
        icon: "success",
        confirmButtonColor: "#018180",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data || "Hubo un problema al actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
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
    <StyledContainer>
      <h2 className="text-center" style={{ color: "#018180" }}>Editar Perfil ({perfil.rol})</h2>
      <Form onSubmit={handleSubmit}>
        {["name", "lastname", "surname", "email"].map((field) => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
            <Form.Control
              type={field === "email" ? "email" : "text"}
              name={field}
              value={perfil[field] || ""}
              onChange={handleChange}
            />
          </Form.Group>
        ))}

        <Form.Group className="mb-3">
          <Form.Label>Contraseña Actual</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nueva Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Dejar en blanco si no quieres cambiar"
          />
          {newPassword && (
            <>
              <ProgressBar
                now={passwordStrength * 25}
                variant={
                  passwordStrength === 0 ? "danger" :
                  passwordStrength === 1 ? "warning" :
                  passwordStrength === 2 ? "info" : "success"
                }
                className="mt-2"
              />
              <p className="mt-1 text-muted">
                Seguridad: {["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][passwordStrength]}
              </p>
            </>
          )}
        </Form.Group>

        <StyledButton type="submit" className="w-100 mt-3">
          Confirmar Cambios
        </StyledButton>
      </Form>
    </StyledContainer>
  );
};

export default EditPerfilAgente;
