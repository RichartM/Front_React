import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../services/passwordService"; // ✅ Importación corregida
import bgImage from "../../img/EsteBueno.avif";
import NavLandingPage from "../LandingPage/NavLandingPage";
import Loader from "../../components/Loader"; // ✅ Importar el componente Loader

// 🔹 Estilos globales
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
  ::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(4px);
    z-index: -1;
  }
`;

const FormContainer = styled.div`
  width: 350px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  padding: 25px 30px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
`;

const Input = styled.input`
  border-radius: 20px;
  border: 1px solid #c0c0c0;
  background-color: white;
  outline: none;
  padding: 12px 15px;
  color: #333;
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
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

// 🔹 Componente principal
const RecuperarContraseña = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Validación de correo electrónico
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Validar si el email está vacío
    if (!email.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingresa tu correo electrónico.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
      return;
    }

    // 🔹 Validar si el email es válido
    if (!validateEmail(email)) {
      Swal.fire({
        title: "Error",
        text: "Ingresa un correo electrónico válido.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordReset(email);

      Swal.fire({
        title: "Solicitud enviada",
        text:
          response.message ||
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
        icon: "success",
        confirmButtonColor: "#018180",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al enviar la solicitud. Inténtalo de nuevo más tarde.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavLandingPage />
      <BackgroundContainer>
        <FormContainer>
          <Title>Recuperar Contraseña</Title>

          {loading && <Loader />} {/* ✅ Mostrar Loader mientras carga */}

          <StyledForm onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <FormButton type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </FormButton>
          </StyledForm>

          <GoBackLink onClick={() => navigate("/login")}>
            Volver al inicio de sesión
          </GoBackLink>
        </FormContainer>
      </BackgroundContainer>
    </>
  );
};

export default RecuperarContraseña;
