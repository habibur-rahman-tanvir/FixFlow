"use client";

import { api } from "@/lib/axios/client";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import {
  createContext,
  type Dispatch,
  ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

interface GoogleAuthResult {
  code?: string;
}

interface AuthContextType {
  uiBlocked: boolean;
  isProcessing: boolean;
  loginWithGoogle: () => void;
  actionType: "signup" | "login";
  setActionType: Dispatch<SetStateAction<"signup" | "login">>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uiBlocked, setUiBlocked] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"signup" | "login">("signup");

  const router = useRouter();

  const googleResponse = async (
    authResult: GoogleAuthResult,
  ): Promise<void> => {
    if (!authResult || !authResult.code) {
      setUiBlocked(false);
      return;
    }
    setUiBlocked(true);
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
      setUiBlocked(false);
      setIsProcessing(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: () => {
      // console.error("Google login error:", error);
      setUiBlocked(false);
    },
    onNonOAuthError: () => {
      // console.error("Google popup error:", error);
      setUiBlocked(false);
    },
    flow: "auth-code",
  });

  const loginWithGoogle = () => {
    if (isProcessing) return;
    setUiBlocked(true);
    googleLogin();
  };

  return (
    <AuthContext.Provider
      value={{
        uiBlocked,
        isProcessing,
        loginWithGoogle,
        actionType,
        setActionType,
      }}
    >
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
