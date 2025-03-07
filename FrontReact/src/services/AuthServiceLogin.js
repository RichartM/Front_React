import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

/**
 * 📌 Verifica si el token ha expirado
 * @returns {boolean} - true si el token ha expirado, false si sigue siendo válido.
 */
const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (!token) return true; // Si no hay token, está "expirado"

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
        const expiration = payload.exp * 1000; // Convertir a milisegundos
        return Date.now() > expiration; // Comparar con la fecha actual
    } catch (error) {
        console.error("❌ Error al verificar la expiración del token:", error);
        return true; // Si hay un error, asumimos que está expirado
    }
};

/**
 * 📌 Iniciar sesión y almacenar el token en localStorage
 * @returns {Object} - Token y flag si debe cambiar la contraseña
 */
const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'Login', { email, password });

        if (response.data) {
            const { token, forcePasswordChange } = response.data;
            localStorage.setItem('token', token);
            return { token, forcePasswordChange };
        }
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error.response?.data || error.message);
        throw error.response?.data || 'Error al iniciar sesión';
    }
};

/**
 * 📌 Cerrar sesión eliminando el token
 */
const logout = () => {
    console.log("🔹 Cerrando sesión, eliminando token...");
    localStorage.removeItem('token');
    window.location.href = '/login';
};

/**
 * 📌 Obtener el rol del usuario desde el token
 * @returns {string|null} - Retorna el rol si el token es válido, de lo contrario null.
 */
const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
        return payload.rol || null;
    } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        return null;
    }
};

/**
 * 📌 Obtener `user_id` del token
 * @returns {number|null} - Retorna el ID del usuario si el token es válido, de lo contrario null.
 */
const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("❌ No se encontró el token en localStorage.");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
        console.log("🔹 user_id extraído del token:", payload.user_id);
        return payload.user_id || null;
    } catch (error) {
        console.error("❌ Error al extraer user_id del token:", error);
        return null;
    }
};

// 📌 Exportar todas las funciones
export default {
    login,
    logout,
    getRoleFromToken,
    getUserIdFromToken, // ✅ Agregado correctamente
    isTokenExpired
};
