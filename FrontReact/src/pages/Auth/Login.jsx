import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../img/EsteBueno.avif';
import NavLandingPage from '../LandingPage/NavLandingPage';
import AuthServiceLogin from '../../services/AuthServiceLogin';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
        const token = await AuthServiceLogin.login(email, password);
        if (token) {
            const role = AuthServiceLogin.getRoleFromToken(); // Obtener el rol del usuario

            // Redirigir según el rol
            if (role === 'GERENTE') {
                navigate('/gerente/agenteVentas');
            } else if (role === 'AGENTE') {
                navigate('/agente');
            } else if (role === 'CLIENTE') {
                navigate('/cliente');
            } else {
                setMessage('Rol desconocido, contacta con soporte.');
            }
        } else {
            setMessage('No se recibió token.');
        }
    } catch (error) {
        console.error('Error de autenticación:', error);
        setMessage('Credenciales incorrectas o error en el servidor.');
    }
};


  return (
    <>
      <NavLandingPage />
      <BackgroundContainer>
        <FormContainer>
          <Title>Bienvenido</Title>
          {message && <ErrorMessage>{message}</ErrorMessage>}
          <StyledForm onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Correo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PageLink onClick={() => navigate('/recuperar-contraseña')}>
              Olvidaste tu contraseña?
            </PageLink>
            <FormButton type="submit">Iniciar sesión</FormButton>
          </StyledForm>
          <SignUpLabel>
            Aun no estás registrado?{" "}
            <SignUpLink
              onClick={() => {
                navigate('/landing');
                setTimeout(() => {
                  const registroSection = document.getElementById("registro");
                  if (registroSection) {
                    const offset = -100;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = registroSection.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition + offset;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }, 300);
              }}
            >
              Registrate
            </SignUpLink>
          </SignUpLabel>
        </FormContainer>
      </BackgroundContainer>
    </>
  );
};

const FormContainer = styled.div`
  width: 350px;
  height: 400px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 30px;
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
    pointer-events: none; /*Evita que la imagen capture clics */

  }
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 10px;
`;

export default Login;
