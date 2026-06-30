import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicOnlyRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicOnlyRoute;
