import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const getUserProfile = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("⚠ No hay token en localStorage. Redirigiendo al login...");
            throw new Error("No hay token disponible");
        }

        console.log("🔹 Token enviado en la petición:", token);
        console.log("🔹 Headers enviados:", { Authorization: `Bearer ${token}` });

        const response = await axios.get(`${API_URL}perfilCliente`, { 
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("✅ Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error en la petición:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            console.warn("⚠ Token inválido o expirado.");
            throw "Token expirado o inválido.";
        }

        throw error.response?.data || "Error al obtener el perfil.";
    }
};

// ✅ Exporta la función correctamente
export default getUserProfile;
