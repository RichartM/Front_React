import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const AuthServiceRegister = {
    registerCliente: async (clienteData) => {
        try {
            const response = await axios.post(API_URL + 'registerCliente', clienteData);
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Error al registrar cliente';
        }
    }
};

export default AuthServiceRegister;
