import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  return axios.get(
    `${API_URL}perfilAgente`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  .then(response => response.data)
  .catch(error => {
    console.error("❌ Error al obtener perfil:", error.response ? error.response.data : error.message);
    throw error;
  });
};

const updateUserProfile = (userData) => {
  const token = localStorage.getItem("token");

  return axios.put(
    `${API_URL}perfilAgente`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  .then(response => response.data)
  .catch(error => {
    console.error("❌ Error al actualizar perfil:", error.response ? error.response.data : error.message);
    throw error;
  });
};

export default {
  getUserProfile,
  updateUserProfile,
};
