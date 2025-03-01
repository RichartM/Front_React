import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ allowedRoles }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());

    useEffect(() => {
        const checkAuth = () => {
            if (!AuthService.isAuthenticated()) {
                console.warn("Token expirado o eliminado. Redirigiendo al login...");
                setIsAuthenticated(false);
            }
        };

        const interval = setInterval(checkAuth, 5000); // Verifica cada 5 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
