"use client";

import { api } from "@/lib/axios/client";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const router = useRouter();

  const googleResponse = async (authResult: any) => {
    if (!authResult || !authResult.code) {
      setIsProcessing(false);
      return;
    }
    setIsProcessing(true);
    try {
      const res = await api.post(
        `/api/auth/google?code=${encodeURIComponent(authResult.code)}`,
      );
      if (res.status === 201 || res.status === 200) {
        router.push("/profile");
        return;
      }
    } catch (err: any) {
      console.error("AuthErr:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,

    onError: (error) => {
      console.error("Google login error:", error);
      setIsProcessing(false);
    },

    onNonOAuthError: (error) => {
      console.error("Google popup error:", error);
      setIsProcessing(false);
    },
    flow: "auth-code",
  });

  const loginWithGoogle = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    googleLogin();
  };

  return (
    <AuthContext.Provider value={{ isProcessing, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
