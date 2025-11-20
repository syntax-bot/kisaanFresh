import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Landing from "../Landing/Landing";

const PublicRoute = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return !isAuthenticated ?  <Outlet /> : <Navigate to="/home" replace /> ;
};



export default PublicRoute;

