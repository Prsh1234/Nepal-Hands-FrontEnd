import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem("AUTH_TOKEN");
    const roles = (localStorage.getItem("role") || "").split(",");

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    const hasAccess = allowedRoles.some(role => roles.includes(role));

    if (!hasAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;