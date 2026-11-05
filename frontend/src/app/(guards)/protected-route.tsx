"use client";

import { SplashScreen } from "@/components/splash-screen.ts/splash-screen";
import { useAuth } from "@/context/auth/AuthContext";
import { Role } from "@/dto/user/user.dto";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function ProtectedRoute({
  children,
  role,
  reverse = false,
}: {
  children: ReactNode;
  role?: Role;
  reverse?: boolean;
}) {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  const hasAccess = !!user && (role === undefined || user.role === role);

  const isAllowed = reverse ? !hasAccess : hasAccess;

  useEffect(() => {
    if (isAuthLoading || isAllowed) return;

    if (!user) {
      router.replace("/signup");
      return;
    }

    router.replace("/profile");
  }, [isAuthLoading, isAllowed, user, router]);

  if (isAuthLoading || !isAllowed) {
    return <SplashScreen />;
  }

  return children;
}
