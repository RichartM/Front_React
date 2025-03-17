import axios from "axios";

const API_URL = "http://localhost:8080/servicios"; // Asegúrate de que la URL es la correcta

const ServiciosService = {
    //  Obtener todos los servicios
    obtenerServicios: async () => {
        try {
            const response = await axios.get(`${API_URL}/obtener`);
            return response.data;
        } catch (error) {
            console.error("❌ Error obteniendo los servicios:", error);
            throw error;
        }
    },

    // Obtener un servicio por ID
    obtenerServicioPorId: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/obtener/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ Error obteniendo el servicio con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear un nuevo servicio
    crearServicio: async (nuevoServicio) => {
        try {
            const response = await axios.post(`${API_URL}/crear`, nuevoServicio, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error("❌ Error al crear el servicio:", error);
            throw error;
        }
    },

    // Actualizar un servicio por ID
    actualizarServicio: async (id, servicioActualizado) => {
        try {
            const response = await axios.put(`${API_URL}/actualizar`, servicioActualizado, {
                headers: { "Content-Type": "application/json" },
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Error al actualizar el servicio con ID ${id}:`, error);
            throw error;
        }
    },
};

export default ServiciosService;
