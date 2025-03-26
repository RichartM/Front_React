// src/services/AgenteService/AuthServiceAgente.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}perfilAgente`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateUserProfile = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}perfilAgente`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
};
