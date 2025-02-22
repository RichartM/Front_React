import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RecuperarContraseña = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa tu correo electrónico.",
        icon: "error",
        confirmButtonColor: "#018180",
        customClass: { confirmButton: "btn-swal-confirmar" },
      });
      return;
    }

    // Simulación de solicitud de recuperación de contraseña
    Swal.fire({
      title: "Solicitud enviada",
      text: "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
      icon: "success",
      confirmButtonColor: "#018180",
      customClass: { confirmButton: "btn-swal-confirmar" },
    }).then(() => {
      navigate("/login"); // Redirige al Login después de la alerta
    });
  };

  return (
    <BackgroundContainer>
      <FormContainer>
        <Title>Recuperar Contraseña</Title>
        <StyledForm onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Correo electrónico"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormButton type="submit">Enviar</FormButton>
        </StyledForm>
        <GoBackLink onClick={() => navigate("/login")}>Volver al inicio de sesión</GoBackLink>
      </FormContainer>
    </BackgroundContainer>
  );
};

// ========== ESTILOS ==========
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  z-index: 0;
  background-color: rgba(255, 255, 255, 0.5);
`;

const FormContainer = styled.div`
  width: 350px;
  height: 300px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  padding: 20px 30px;
  text-align: center;
`;

const Title = styled.p`
  color: black;
  font-size: 22px;
  font-weight: bold;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  border-radius: 20px;
  border: 1px solid #c0c0c0;
  background-color: white;
  outline: none;
  padding: 12px 15px;
  color: #747474;
`;

const FormButton = styled.button`
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  background: #018180;
  color: white;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    background: #026c6c;
  }
`;

const GoBackLink = styled.p`
  color: #018180;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export default RecuperarContraseña;
