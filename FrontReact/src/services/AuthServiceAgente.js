import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const AuthServiceAgente = {
  registerAgente: async (agenteData) => {
    try {
      const response = await axios.post(`${API_URL}registerAgente`, agenteData);
      return response.data;
    } catch (error) {
      console.error("Error al registrar el agente:", error.response?.data || error.message);
      throw error.response?.data || "Error al registrar el agente.";
    }
  },
};

export default AuthServiceAgente;
