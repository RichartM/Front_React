// src/services/AuthServiceProfile.js
import axios from "axios";

const API_URL = "https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth";

const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/perfilCliente`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateUserProfile = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/perfilCliente`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
};