import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
    isAuthenticated: boolean;
};

export function ProtectedRoute({ isAuthenticated }: ProtectedRouteProps) {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}