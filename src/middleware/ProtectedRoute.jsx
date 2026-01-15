import { Navigate } from "react-router-dom";
import useToyotaStore from "../store/ToyotaStore";



const ProtectedRoute = ({ children }) => {
  const token = useToyotaStore((state) => state.token);
  // const removeToken = useToyotaStore((state) => state.removeToken);


  if (!token) {
    // removeToken(); // ถ้า token หมดอายุ ลบออก
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

