import axios from 'axios';

const API_URL = 'http://localhost:8080/marcas'; 

const AgenteService = {
  getAllBrands: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`); 
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo marcas:', error);
      return [];
    }
  }
};

export default AgenteService;
