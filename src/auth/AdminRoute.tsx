import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
