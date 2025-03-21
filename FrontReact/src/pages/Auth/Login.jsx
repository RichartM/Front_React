import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../img/EsteBueno.avif';
import NavLogin from '../LandingPage/NavLogin';
import AuthServiceLogin from "../../services/AuthServiceLogin"; // ✅ Asegurar la importación correcta
import Loader from '../../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const registroRef = useRef(null);

  const handleRegisterRedirect = () => {
    // Navegar a la LandingPage y pasar un estado para indicar que debe desplazarse al formulario de registro
    navigate('/landing', { state: { scrollToRegister: true } });
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await AuthServiceLogin.login(email, password);

      if (response) {
        const { token, mustChangePassword } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("forcePasswordChange", mustChangePassword ? "true" : "false");

        const role = AuthServiceLogin.getRoleFromToken();
        if (mustChangePassword && (role === "CLIENTE" || role === "AGENTE")) {
          navigate("/change-password");
        } else {
          if (role === "GERENTE") {
            navigate("/gerente/panelControl");
          } else if (role === "AGENTE") {
            navigate("/agente/tablaCliente");
          } else if (role === "CLIENTE") {
            navigate("/cliente/home");
          } else {
            setMessage("Rol desconocido, contacta con soporte.");
          }
        }
      } else {
        setMessage("No se recibió token.");
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      setMessage("Credenciales incorrectas o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <NavLogin />
      <BackgroundContainer>
        <FormContainer>
          <Title>Bienvenido</Title>

          {loading && <Loader />} {/* 🔹 Mostrar Loader mientras carga */}

          {message && <ErrorMessage>{message}</ErrorMessage>}

          <StyledForm onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Correo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <PageLink onClick={() => navigate('/recuperar-contraseña')}>
              Olvidaste tu contraseña?
            </PageLink>
            <FormButton type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Iniciar sesión"}
            </FormButton>
          </StyledForm>

          <SignUpLabel>
            Aun no estás registrado?{" "}
            <SignUpLink onClick={handleRegisterRedirect}>
              Regístrate
            </SignUpLink>
          </SignUpLabel>


        </FormContainer>
      </BackgroundContainer>
    </>
  );
};

// 🔹 Estilos

const FormContainer = styled.div`
  width: 350px;
  min-height: 400px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  text-align: center;
  color: black;
  font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
  margin: 10px 0 30px 0;
  font-size: 28px;
  font-weight: 800;
`;

const StyledForm = styled.form`
  width: 100%;
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
  font-family: "Lucida Sans", Geneva, Verdana, sans-serif;
  border-radius: 20px;
  border: none;
  background: teal;
  color: white;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:active {
    box-shadow: none;
  }
`;

const PageLink = styled.p`
  text-align: end;
  color: #747474;
  font-size: 9px;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const SignUpLabel = styled.p`
  font-size: 10px;
  color: #747474;
  text-align: center;
`;

const SignUpLink = styled.span`
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
`;

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
    content: '';
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
    pointer-events: none;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

export default Login;
