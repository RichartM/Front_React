import axios from 'axios';

const API_URL = 'https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/';

// Obtener todos los agentes


// Obtener un agente por ID


// Crear un nuevo agente


// Actualizar un agente existente

const updateAgente = async (id, agente, token) => {
    try {
        const response = await axios.put(`${API_URL}actualizar/${id}`, agente, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el agente:', error);
        throw error;
    }
};

// Actualizar el estado de un agente (Activo/Desactivado)


export default {
    
    updateAgente
};
