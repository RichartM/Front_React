import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import bgImage from "../../img/EsteBueno.avif";
import AuthServiceLogin from "../../services/AuthServiceLogin";
import Loader from "../../components/Loader";

// 🔹 Contenedor estilizado (más corto)
const StyledContainer = styled(Container)`
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-height: auto;
  margin: auto;
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
    pointer-events: none;
  }
`;

const StyledButton = styled(Button)`
  background-color: #018180 !important;
  border: none;
  width: 100%;
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

const ChangePassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Evaluar fortaleza de la contraseña
    const passwordStrength = newPassword ? zxcvbn(newPassword).score : 0;
    const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Debes ingresar y confirmar tu nueva contraseña.",
            });
            return;
        }

        if (!passwordsMatch) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Las contraseñas no coinciden.",
            });
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "La nueva contraseña debe tener al menos 6 caracteres.",
            });
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No estás autenticado.");
            }

            await axios.post(
                "https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/change-password",
                { newPassword },
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            Swal.fire({
                icon: "success",
                title: "¡Contraseña actualizada!",
                text: "Tu contraseña ha sido cambiada con éxito.",
            });

            // ✅ Eliminar la bandera de cambio de contraseña
            localStorage.removeItem("forcePasswordChange");

            // ✅ Redirigir según el rol
            const role = AuthServiceLogin.getRoleFromToken();
            if (role === "GERENTE") {
                navigate("/gerente/agenteVentas");
            } else if (role === "AGENTE") {
                navigate("/agente/tablaCliente");
            } else if (role === "CLIENTE") {
                navigate("/cliente/home");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("❌ Error al cambiar la contraseña:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "No se pudo cambiar la contraseña.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <BackgroundContainer>
            {loading && <Loader />}
            <StyledContainer>
                <h2 className="text-center mb-3">Cambiar Contraseña</h2>
                <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-2">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />


                    </Form.Group>



                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirma tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={
                                newPassword !== "" && confirmPassword !== newPassword
                            }
                            isValid={
                                confirmPassword !== "" && confirmPassword === newPassword
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            Las contraseñas no coinciden.
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            Las contraseñas coinciden.
                        </Form.Control.Feedback>

                        <PasswordStrengthBar
                            now={newPassword === "" ? 0 : (passwordStrength + 1) * 25}
                            strength={passwordStrength}
                        />

                        <p className="mt-1 text-muted">
                            Nivel de seguridad:
                            {newPassword === ""
                                ? "Sin datos"
                                : ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][passwordStrength]
                            }
                        </p>
                    </Form.Group>


                    <div className="text-center">
                        <StyledButton type="submit" disabled={loading}>
                            {loading ? "Procesando..." : "Actualizar"}
                        </StyledButton>
                    </div>
                </Form>
            </StyledContainer>
        </BackgroundContainer>
    );
};

export default ChangePassword;
