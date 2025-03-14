import { Navigate, Outlet } from "react-router-dom";

const RequirePasswordChange = () => {
    const mustChangePassword = localStorage.getItem("forcePasswordChange") === "true";

    if (mustChangePassword) {
        return <Navigate to="/change-password" replace />;
    }

    return <Outlet />;
};

export default RequirePasswordChange;
