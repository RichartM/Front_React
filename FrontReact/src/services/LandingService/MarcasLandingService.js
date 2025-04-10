import axios from 'axios';

const API_URL = 'https://bwubka276h.execute-api.us-east-1.amazonaws.com/marcas'; // 🔹 Corrige la "M" mayúscula

const MarcasLandingService = {
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

export default MarcasLandingService;
