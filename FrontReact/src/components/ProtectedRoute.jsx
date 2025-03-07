import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const location = useLocation(); // Detecta cambios en la URL

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("Token eliminado. Redirigiendo al login...");
                setIsAuthenticated(false);
                setTimeout(() => {
                    window.location.href = "/login"; // Redirigir y recargar si el token fue eliminado
                }, 100);
            }
        };

        checkAuth(); //Verificar autenticación al cargar la página

        // Detectar si el usuario eliminó el token en otra pestaña
        window.addEventListener("storage", checkAuth);

        // Detectar si el usuario usa "atrás" en el navegador
        window.addEventListener("popstate", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("popstate", checkAuth);
        };
    }, [location]); // Se ejecuta cada vez que cambia la URL

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
