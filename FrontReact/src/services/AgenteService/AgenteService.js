import axios from 'axios';

const API_URL = 'http://localhost:8080/marcas'; // 🔹 Corrige la "M" mayúscula

const AgenteService = {
  getAllBrands: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`); // 🔹 Ahora apunta a la ruta correcta
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo marcas:', error);
      return [];
    }
  }
};

export default AgenteService;
