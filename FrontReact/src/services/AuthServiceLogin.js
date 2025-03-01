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
        console.error("Error al verificar la expiración del token:", error);
        return true; // Si hay un error, asumimos que está expirado
    }
};

// 📌 Iniciar sesión
const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'Login', { email, password });

        if (response.data) {
            const { token, forcePasswordChange } = response.data;
            localStorage.setItem('token', token);
            return { token, forcePasswordChange };
        }
    } catch (error) {
        throw error.response?.data || 'Error al iniciar sesión';
    }
};

/**
 * 📌 Cerrar sesión eliminando el token
 */
const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

// 📌 Obtener el rol del usuario desde el token almacenado en localStorage
const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token
        return payload.rol;
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};

// 📌 Exportar todas las funciones
export default {
    login,
    logout,
    getRoleFromToken,
    isTokenExpired // ✅ Agregar la nueva función aquí
};
