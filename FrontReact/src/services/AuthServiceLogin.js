import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/api/auth/";
let lastTokenCheck = null; // Almacena la última vez que se verificó el token
let isLoggingOut = false; // Bandera para evitar múltiples redirecciones

/**
 * 📌 Iniciar sesión y almacenar el token en localStorage.
 * @returns {Object} - Devuelve el token y si el usuario debe cambiar la contraseña.
 */
const login = async (email, password) => {
    console.log("que pasa en el login",email," ",password)

    try {
        const response = await axios.post(API_URL + "Login", { email, password });

        if (response.data) {
            const { token, mustChangePassword } = response.data;

            if (!token) {
                throw new Error("No se recibió un token del backend.");
            }

            // ✅ Guardar el token en localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("forcePasswordChange", mustChangePassword ? "true" : "false");

            // ✅ Configurar axios para enviar el token automáticamente en todas las solicitudes
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            console.log("✅ Nuevo token generado y almacenado:", token);

            return { token, mustChangePassword };
        } else {
            throw new Error("No se recibió respuesta válida del backend.");
        }
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error.response?.data || error.message);
        throw error.response?.data || "Error al iniciar sesión.";
    }
};

/**
 * 📌 Cerrar sesión eliminando el token y redirigiendo al login.
 */
const logout = () => {
  if (isLoggingOut) return; // Evitar múltiples ejecuciones
  isLoggingOut = true;

  console.log("🔹 Cerrando sesión...");
  localStorage.removeItem("token");
  localStorage.removeItem("forcePasswordChange");

  // ✅ Eliminar el token de axios para evitar solicitudes no autorizadas
  delete axios.defaults.headers.common["Authorization"];

  Swal.fire({
    title: "Sesión expirada",
    text: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    icon: "warning",
    confirmButtonColor: "#018180",
  }).then(() => {
    window.location.href = "/login";
  });
};

/**
 * 📌 Obtener el rol del usuario desde el token.
 * @returns {string|null} - Retorna el rol si el token es válido, de lo contrario `null`.
 */
const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
        if (!payload.rol) throw new Error("El token no contiene información de rol.");
        
        console.log("🔹 Rol obtenido del token:", payload.rol);
        return payload.rol;
    } catch (error) {
        console.error("❌ Error al decodificar token:", error);
        return null;
    }
};

/**
 * 📌 Verificar si el token ha expirado.
 * @returns {boolean} - `true` si el token ha expirado, `false` si sigue válido.
 */
const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000; // Convertir a milisegundos

    // Solo imprime la expiración si no se ha verificado recientemente
    if (!lastTokenCheck || Date.now() - lastTokenCheck > 60000) { // 60 segundos
      console.log("🔹 Expiración del token:", new Date(expiration).toLocaleString());
      lastTokenCheck = Date.now();
    }

    return Date.now() > expiration;
  } catch (error) {
    console.error("❌ Error al verificar expiración del token:", error);
    return true;
  }
};

/**
 * 📌 Interceptor para verificar la validez del token antes de cada solicitud
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Verificar la expiración del token solo si no se ha verificado recientemente
      if (isTokenExpired()) {
        console.warn("⚠️ Token expirado, cerrando sesión...");
        logout();
        return Promise.reject(new Error("Token expirado.")); // Rechazar la solicitud sin alerta
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("❌ Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

// 📌 Exportar funciones
export default {
    login,
    logout,
    getRoleFromToken,
    isTokenExpired,
};