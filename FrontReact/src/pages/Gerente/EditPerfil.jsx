import React, { useState, useEffect } from "react";
import { usePerfilGerente } from '../../context/PerfilGerenteContext'; // Cambiado a usePerfilGerente
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

const EditPerfil = () => {
  const [perfil, setPerfil] = useState({
    name: '',
    lastname: '',
    surname: '',
    username: '',
    email: '',
    rol: ''
  });
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Cambiado a usePerfilGerente para consistencia
  const { perfil: perfilContext, updatePerfil } = usePerfilGerente();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await AuthServiceProfile.getUserProfile();
        setPerfil(prev => ({
          ...prev,
          name: userData.name || '',
          lastname: userData.lastname || '',
          surname: userData.surname || '',
          username: userData.username || '',
          email: userData.email || '',
          rol: userData.rol || ''
        }));
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

  // Sincroniza con el contexto cuando esté disponible
  useEffect(() => {
    if (perfilContext && perfilContext.name) {
      setPerfil(prev => ({ ...prev, ...perfilContext }));
    }
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
      Swal.fire({
        title: "Error",
        text: "Debes ingresar tu contraseña actual para actualizar el perfil.",
        icon: "error",
        confirmButtonColor: "#018180",
      });
      return;
    }
  
    try {
      const response = await AuthServiceProfile.updateUserProfile({
        ...perfil,
        currentPassword,
        newPassword: newPassword || undefined
      });
  
      if (response) {
        setPerfil(prev => ({
          ...prev,
          ...response
        }));
        await updatePerfil(); // Esto actualizará el contexto

        Swal.fire({
          title: "Éxito",
          text: "Perfil actualizado correctamente",
          icon: "success",
          confirmButtonColor: "#018180",
        });
      }
    } catch (error) {
      console.error("Error detallado en el componente:", error);
      
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al actualizar el perfil.",
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
    <StyledContainer style={{ marginTop: "30%" }}>
      <h2 className="text-center" style={{ color: "#018180" }}>Editar Perfil ({perfil.rol})</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={perfil.name || ""} 
            onChange={handleChange} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control 
            type="text" 
            name="lastname" 
            value={perfil.lastname || ""} 
            onChange={handleChange} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Segundo Apellido</Form.Label>
          <Form.Control 
            type="text" 
            name="surname" 
            value={perfil.surname || ""} 
            onChange={handleChange} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            name="username" 
            value={perfil.username || ""} 
            onChange={handleChange} 
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={perfil.email || ""} 
            onChange={handleChange} 
          />
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
              variant={
                passwordStrength === 0 ? "danger" : 
                passwordStrength === 1 ? "warning" : 
                passwordStrength === 2 ? "info" : "success"
              }
              className="mt-2"
            />
          )}
          <p className="mt-1 text-muted">
            Nivel de seguridad: {["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][passwordStrength]}
          </p>
        </Form.Group>

        <StyledButton type="submit" className="w-100 mt-3">
          Confirmar Cambios
        </StyledButton>
      </Form>
    </StyledContainer>
  );
};

export default EditPerfil;