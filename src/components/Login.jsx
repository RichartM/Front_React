import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import bgImage from '../img/EsteBueno.avif';

const Form = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulación de autenticación
    if (email === 'gerente' && password === 'gerente') {
      onLogin('gerente'); // Asigna el rol de gerente
      navigate('/gerente'); // Redirige al dashboard del gerente
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <BackgroundContainer>
      <FormContainer>
        <Title>Bienvenido</Title>
        <StyledForm onSubmit={handleLogin}>
          <Input 
            type="text" 
            placeholder="Usuario" 
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
          <PageLink>Olvidaste tu contraseña?</PageLink>
          <FormButton type="submit">Iniciar sesión</FormButton>
        </StyledForm>
        <SignUpLabel>
          Aun no estas registrado? <SignUpLink>Registrate</SignUpLink>
        </SignUpLabel>
      </FormContainer>
    </BackgroundContainer>
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
  color: teal;
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const SocialButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 10px 15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  cursor: pointer;
  font-size: 11px;
  gap: 5px;
  
`;
const BackgroundContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed; /* Fija el fondo en la pantalla */
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Evita barras de desplazamiento */
  z-index: 0; /* Asegura que el fondo esté detrás del contenido */

  /* Crea un pseudo-elemento para aplicar el fondo */
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
    filter: blur(4px); /* Aplica el desenfoque solo a la imagen */
    z-index: -1; /* Asegura que el fondo se quede detrás del contenido */
  }
`;


export default Form;
