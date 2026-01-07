import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/auth/useUser";
import { Spinner } from "./Spinner";

const ProtectedRoute = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  if (!user || user?.email !== "boris@gmail.com") {
    return <Navigate to="/adminlogin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
