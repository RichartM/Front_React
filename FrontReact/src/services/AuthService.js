import axios from "axios";

const API_URL = "https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/";

/**
 * 📌 Obtener el perfil del usuario autenticado.
 * Si el token es inválido o ha expirado, cierra sesión automáticamente.
 */
const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No hay token disponible");
        }

        const response = await axios.get(`${API_URL}profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("⚠️ Token expirado o inválido. Cerrando sesión...");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw error.response?.data || "Error al obtener el perfil.";
    }
};

/**
 * 📌 Registrar un nuevo cliente.
 */
const registerCliente = async (clienteData) => {
    try {
        const response = await axios.post(API_URL + "registerCliente", clienteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Error al registrar cliente.";
    }
};

/**
 * 📌 Obtener `user_id` del token.
 * @returns {number|null} - Retorna el ID del usuario si el token es válido, de lo contrario `null`.
 */
const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("❌ No se encontró el token en localStorage.");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
        console.log("🔹 user_id extraído del token:", payload.user_id);
        return payload.user_id || null;
    } catch (error) {
        console.error("❌ Error al extraer user_id del token:", error);
        return null;
    }
};

export default {
    getUserProfile,
    registerCliente,
    getUserIdFromToken,
};
