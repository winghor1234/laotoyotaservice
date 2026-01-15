import { Navigate } from "react-router-dom";
import useToyotaStore from "../store/ToyotaStore";

const PublicRoute = ({ children }) => {
  const token = useToyotaStore((state) => state.token);

  if (token) {
    return <Navigate to="/user/dashboard" replace />;
  }
  return children;
};

export default PublicRoute;

