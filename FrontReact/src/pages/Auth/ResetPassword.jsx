import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Form, Button, Container, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import zxcvbn from "zxcvbn";
import bgImage from "../../img/EsteBueno.avif";
import { resetPassword } from "../../services/passwordService";
import Loader from "../../components/Loader";

// 🔹 Contenedor estilizado
const StyledContainer = styled(Container)`
  width: 400px;
  display: flex;
  flex-direction: column;
  min-height: auto;
  align-items: center;
  justify-content: center;
  margin-top: -85px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 9px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
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
        pointer-events: none; /*Evita que la imagen capture clics */

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

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Obtener el token de la URL cuando se carga el componente
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromURL = params.get("token");
        setToken(tokenFromURL);
    }, [location]);

    // Evaluar fortaleza de la contraseña
    const passwordStrength = newPassword ? zxcvbn(newPassword).score : 0;
    const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

    // Manejo del formulario
    const handleSubmit = async (e) => {
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

        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            Swal.fire({
                icon: "success",
                title: "¡Contraseña restablecida!",
                text: "Tu contraseña ha sido actualizada correctamente.",
            }).then(() => {
                navigate("/login");
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El token ha expirado o es inválido.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <BackgroundContainer>

            <div style={{ marginTop: "100px" }}>
                {loading && <Loader />}
                <StyledContainer>
                    <h2 className="text-center mb-4">Restablecer Contraseña</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <PasswordStrengthBar now={(passwordStrength + 1) * 25} strength={passwordStrength} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>

                        <div className="text-center">
                            <StyledButton type="submit" disabled={loading}>
                                {loading ? "Procesando..." : "Restablecer"}
                            </StyledButton>
                        </div>
                    </Form>
                </StyledContainer>
            </div>
        </BackgroundContainer>
    );
};

export default ResetPassword;
