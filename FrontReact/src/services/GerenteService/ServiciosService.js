import axios from 'axios';

const API_URL = 'http://localhost:8080/servicios'; // Asegúrate de cambiar esta URL a la correcta si es diferente

// Función para obtener todos los servicios
export const getServicios = (token) => {
    return axios.get(`${API_URL}/obtener`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// Función para agregar un nuevo servicio
export const addServicio = (nuevoServicio, token) => {
    return axios.post(`${API_URL}/crear`, nuevoServicio, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// Función para actualizar un servicio
export const updateServicio = (id, updatedServicio, token,noom) => {
    updateServicio.nomenclatura  = noom
    return axios.put(`http://localhost:8080/servicios/actualizar/${id}`, updatedServicio, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
;

// Función para cambiar el estado de un servicio (activar/desactivar)
export const toggleEstadoServicio = (id, estado, token) => {
    return axios.put(
        `${API_URL}/estado/${id}`,
        { estado: estado }, // Se envía solo el nuevo estado (activo o inactivo)
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );
};

// Función para eliminar un servicio
export const deleteServicio = (id, token) => {
    return axios.delete(`${API_URL}/eliminar/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
