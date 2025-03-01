import axios from 'axios';

// URL de tu backend
const API_URL = 'http://localhost:8080/api/auth/';

const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No hay token disponible");
        }

        const response = await axios.get(`${API_URL}profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.warn("Token expirado o inválido. Redirigiendo al login...");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        throw error.response?.data || "Error al obtener el perfil.";
    }
}
// Función para iniciar sesión
const login = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'Login', { email, password });

        if (response.data) {
            localStorage.setItem('token', response.data); // Guardar el token en localStorage
            return response.data;
        }
    } catch (error) {
        throw error.response?.data || 'Error al iniciar sesión';
    }
};

// Función para cerrar sesión
const logout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/login'; // Redirigir al login inmediatamente
};

// Función para registrar clientes
const registerCliente = async (clienteData) => {
    try {
        const response = await axios.post(API_URL + 'registerCliente', clienteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al registrar cliente';
    }
};

// Función para obtener el rol desde el token
const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar JWT
        return payload.rol; // Devolver el rol desde el token
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};

// Exportar todas las funciones correctamente
export default {
    login,
    logout,
    getRoleFromToken,
    registerCliente
};
