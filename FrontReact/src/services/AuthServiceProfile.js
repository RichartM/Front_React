import axios from "axios";
import AuthServiceLogin from "./AuthServiceLogin";

const API_URL = "http://localhost:8080/api/auth/";

const AuthServiceProfile = {
  // 📌 Obtener el perfil según el rol del usuario
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado en localStorage");

      const role = AuthServiceLogin.getRoleFromToken();
      if (!role) {
        console.error("❌ No se pudo obtener el rol del usuario.");
        throw new Error("No se pudo determinar el rol del usuario.");
      }

      // 🔹 Determinar el endpoint según el rol
      let endpoint = role === "GERENTE" ? "perfilGerente" : role === "AGENTE" ? "perfilAgente" : "perfilCliente";

      console.log(`🔹 Obteniendo perfil desde: ${API_URL}${endpoint}`);

      const response = await axios.get(`${API_URL}${endpoint}`, { 
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error en la petición:", error.response?.status, error.response?.data);

      if (error.response?.status === 401) {
        console.warn("⚠ Token inválido o expirado.");
        throw new Error("Token expirado o inválido.");
      }

      throw error.response?.data || "Error al obtener el perfil.";
    }
  },

  updateUserProfile: async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado en localStorage");
  
      const role = AuthServiceLogin.getRoleFromToken();
      if (!role) throw new Error("No se pudo determinar el rol del usuario.");
  
      let endpoint = role === "GERENTE" ? "perfilGerente" : 
                   role === "AGENTE" ? "perfilAgente" : "perfilCliente";
  
      console.log("Datos enviados al backend:", updatedData);
  
      const response = await axios.put(`${API_URL}${endpoint}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      console.log("Respuesta del servidor:", response.data);
      return response.data;
  
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta de error:", error.response);
      
      let errorMessage = "Error al actualizar el perfil.";
      if (error.response) {
        // El servidor respondió con un status code fuera del rango 2xx
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        // Algo pasó al configurar la petición
        errorMessage = error.message;
      }
  
      throw new Error(errorMessage);
    }
  },
  // 📌 Cambiar la contraseña después del login obligatorio
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado.");
      if (!currentPassword || !newPassword) throw new Error("Debes proporcionar tu contraseña actual y la nueva contraseña.");

      const response = await axios.put(
        `${API_URL}change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      console.log("✅ Contraseña cambiada correctamente:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al cambiar la contraseña:", error.response?.data || error.message);
      throw error.response?.data || "No se pudo cambiar la contraseña.";
    }
  },

  // 📌 Solicitar restablecimiento de contraseña (recuperación por correo)
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${API_URL}forgot-password`, { email });
      console.log("✅ Solicitud de recuperación enviada:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error en la solicitud de recuperación:", error.response?.data || error.message);
      throw error.response?.data || "Error al solicitar recuperación de contraseña.";
    }
  },

  // 📌 Restablecer la contraseña con el token enviado por correo
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}reset-password`, { token, newPassword });
      console.log("✅ Contraseña restablecida con éxito:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error al restablecer la contraseña:", error.response?.data || error.message);
      throw error.response?.data || "Error al restablecer la contraseña.";
    }
  }
};

export default AuthServiceProfile;
