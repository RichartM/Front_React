import { Navigate, Outlet } from "react-router-dom";

/**
 * 📌 Verifica si el usuario debe cambiar su contraseña antes de acceder a la app
 */
const RequirePasswordChange = () => {
    const mustChangePassword = localStorage.getItem("forcePasswordChange") === "true";

    return mustChangePassword ? <Navigate to="/change-password" /> : <Outlet />;
};

export default RequirePasswordChange;
