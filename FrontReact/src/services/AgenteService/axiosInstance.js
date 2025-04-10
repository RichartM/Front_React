import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bwubka276h.execute-api.us-east-1.amazonaws.com/api/auth/',
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
