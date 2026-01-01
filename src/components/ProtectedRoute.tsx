import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/auth/useUser";
import { Spinner } from "./Spinner";

const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useUser();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
