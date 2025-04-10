import axios from "axios";

const API_URL = "https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/";

/**
 * 📌 Solicitar restablecimiento de contraseña
 * @param {string} email - Correo del usuario
 * @returns {Promise<string>} - Mensaje del servidor
 */
export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.error("Error en la solicitud de recuperación:", error.response?.data || error.message);
        throw error.response?.data || "Error al solicitar recuperación de contraseña.";
    }
};

/**
 * 📌 Restablecer contraseña con el token enviado por correo
 * @param {string} token - Token de recuperación (JWT)
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<string>} - Mensaje del servidor
 */
export const resetPassword = async (token, newPassword) => {
    try {
        const response = await axios.post(
            `${API_URL}reset-password`,
            { newPassword }, // el token no va aquí, va en el header
            {
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ token en el header
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error.response?.data || error.message);
        throw error.response?.data || "Error al restablecer la contraseña.";
    }
};

/**
 * 📌 Cambiar la contraseña después del login obligatorio
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<string>} - Mensaje del servidor
 */
export const changePassword = async (newPassword) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No estás autenticado.");
        }

        if (!newPassword) {
            throw new Error("Debes proporcionar una nueva contraseña.");
        }

        const response = await axios.post(
            `${API_URL}change-password`,
            { newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error.response?.data || error.message);
        throw error.response?.data || "No se pudo cambiar la contraseña.";
    }
};
