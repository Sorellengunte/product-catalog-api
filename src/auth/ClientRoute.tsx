import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export default function ClientRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
