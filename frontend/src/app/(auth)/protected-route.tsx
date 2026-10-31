"use client";

import { SplashScreen } from "@/components/splash-screen.ts/splash-screen";
import { useAuth } from "@/context/auth/AuthContext";
import { Role } from "@/dto/user/user.dto";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: Role;
}) {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/signup");
      return;
    }

    if (!isAuthLoading && user && role !== undefined && user.role !== role) {
      router.replace(`/profile`);
    }
  }, [isAuthLoading, user, router, role]);

  if (isAuthLoading || !user) {
    return <SplashScreen />;
  }

  return children;
}
