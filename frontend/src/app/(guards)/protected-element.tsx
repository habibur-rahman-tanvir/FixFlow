"use client";

import { useAuth } from "@/context/auth/AuthContext";
import type { Role } from "@/types/user/user.dto";
import type { ReactNode } from "react";

export function ProtectedElement({
  children,
  role,
  reverse = false,
  fallback = null,
}: {
  children: ReactNode;
  role?: Role | Role[];
  reverse?: boolean;
  fallback?: ReactNode;
}) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return fallback;
  }

  const allowedRoles = role ? (Array.isArray(role) ? role : [role]) : undefined;

  const hasAccess =
    !!user && (!allowedRoles || allowedRoles.includes(user.role));

  const isAllowed = reverse ? !hasAccess : hasAccess;

  return isAllowed ? children : fallback;
}
