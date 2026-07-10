import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUser, isTokenExpired } from "../utils/auth";
import { toast } from "react-toastify";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user = getUser();
  const tokenExpired = isTokenExpired();

  if (tokenExpired || !user) {
    toast.error("Please login to continue");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
