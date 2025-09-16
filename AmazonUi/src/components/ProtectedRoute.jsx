import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useCart } from "../components/DataProvider/DataProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useCart();
  const location = useLocation();

  if (user === undefined) {
    // Still loading, don't render anything yet
    return null;
  }
  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
