import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token || !usuario || usuario.role !== "ROLE_ANFITRIAO") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
