import axios from 'axios';

const API_URL = 'https://bwubka276h.execute-api.us-east-1.amazonaws.com/vehiculo/marca/id';

const VehiculoService = {
  // ✅ Obtiene vehículos por ID de marca
  getVehiclesByBrandId: async (brandId) => {
    try {
      const response = await axios.get(`${API_URL}/${brandId}`);
      return response.data; // Retorna los datos de los vehículos
    } catch (error) {
      console.error('❌ Error obteniendo vehículos por ID de marca:', error);
      return []; // Retorna un array vacío en caso de error
    }
  }
};

export default VehiculoService;
