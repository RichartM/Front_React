import React, { useState } from "react";
import styled from "styled-components";
import { Form, Button, Container, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn"; 

const StyledContainer = styled(Container)`
  width: 400px;
  display: flex;
  flex-direction: column;
  min-height: auto;
  align-items: center;
  justify-content: center;
  margin-top: 120px; /* Margen superior específico */
  
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 9px;
  background: #f8f9fa;
  border-radius: 8px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const StyledButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  &:hover {
    background-color: #016b6a !important;
  }
`;

const PasswordStrengthBar = styled(ProgressBar)`
  margin-top: 10px;
  height: 8px;

  & .progress-bar {
    background-color: ${(props) =>
      props.strength === 0
        ? "#dc3545"
        : props.strength === 1
        ? "#ffc107"
        : props.strength === 2
        ? "#ffc107"
        : props.strength === 3
        ? "#28a745"
        : "#28a745"};
  }
`;

export default function EditPerfil() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Medir la fortaleza de la contraseña
  const passwordStrength = password ? zxcvbn(password).score : 0;

  // Validar si las contraseñas coinciden
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos son obligatorios!",
      });
      return;
    }

    if (!passwordsMatch) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Las contraseñas no coinciden!",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Cambios guardados!",
      text: "Tu perfil ha sido actualizado correctamente.",
    }).then(() => {
      console.log({ nombre, email, password });
    });
  };

  const handleRecoverPassword = () => {
    Swal.fire({
      icon: "info",
      title: "Recuperar contraseña",
      text: "Se enviará un enlace de recuperación a tu correo electrónico.",
    });
  };

  return (
    <div style={{ marginTop: '100px' }}> {/* Margen superior específico */}
    <StyledContainer className="edit-perfil-container">
      <h2 className="text-center mb-4">Editar Perfil</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
          />
          <PasswordStrengthBar
            now={(passwordStrength + 1) * 25}
            strength={passwordStrength}
          />
          <small>
            Fortaleza:{" "}
            {passwordStrength === 0
              ? "Muy débil"
              : passwordStrength === 1
              ? "Débil"
              : passwordStrength === 2
              ? "Regular"
              : passwordStrength === 3
              ? "Fuerte"
              : "Muy fuerte"}
          </small>
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
          />
          <small style={{ color: passwordsMatch ? "#28a745" : "#dc3545" }}>
            {passwordsMatch
              ? "Las contraseñas coinciden"
              : "Las contraseñas no coinciden"}
          </small>
        </Form.Group>

        <div className="text-center">
          <StyledButton type="submit">Guardar Cambios</StyledButton>
        </div>
      </Form>

      <div className="text-center mt-3">
        <Button variant="link" onClick={handleRecoverPassword}>
          ¿Olvidaste tu contraseña?
        </Button>
      </div>
    </StyledContainer>
    </div>

  );
}
