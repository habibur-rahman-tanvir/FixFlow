"use client";

import { useAuth } from "@/context/auth/AuthContext";
import type { Role } from "@/dto/user/user.dto";
import type { ReactNode } from "react";

export function ProtectedElement({
  children,
  role,
  reverse = false,
  fallback = null,
}: {
  children: ReactNode;
  role?: Role;
  reverse?: boolean;
  fallback?: ReactNode;
}) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return fallback;
  }

  const hasAccess = !!user && (role === undefined || user.role === role);

  const isAllowed = reverse ? !hasAccess : hasAccess;

  return isAllowed ? children : fallback;
}
