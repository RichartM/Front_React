import React, { useState } from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../services/passwordService";
import Loader from "../../components/Loader"; // ✅ Import Loader

// 🔹 Styled Components
const Container = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  border-radius: 20px;
  border: 1px solid #c0c0c0;
  background-color: white;
  outline: none;
  padding: 12px 15px;
  color: #333;
  width: 100%;
`;

const Button = styled.button`
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

const ChangePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Las contraseñas no coinciden.", "error");
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire("Error", "La nueva contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
      localStorage.removeItem("forcePasswordChange"); // ✅ Marcar como completado
      Swal.fire("Éxito", "Contraseña cambiada correctamente", "success").then(() => {
        navigate("/login");
      });
    } catch (error) {
      Swal.fire("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Cambiar Contraseña</Title>

      {loading && <Loader />} {/* ✅ Loader mientras carga */}

      <Form>
        <Input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleChangePassword} disabled={loading}>
          {loading ? "Cambiando..." : "Actualizar"}
        </Button>
      </Form>
    </Container>
  );
};

export default ChangePassword;
