"use client";

import { api } from "@/lib/axios/client";
import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  createContext,
  type Dispatch,
  ReactNode,
  type SetStateAction,
  SubmitEvent,
  useContext,
  useState,
} from "react";
import toast from "react-hot-toast";

interface GoogleAuthResult {
  code?: string;
}

type FormInput = {
  name: string;
  email: string;
  password: string;
};

interface AuthContextType {
  uiBlocked: boolean;
  isGoogleProcessing: boolean;
  isSignupOrLoginProcessing: boolean;
  loginWithGoogle: () => void;
  actionType: "signup" | "login";
  setActionType: Dispatch<SetStateAction<"signup" | "login">>;
  handleInput: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  formInput: FormInput;
  handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  fieldsError: any;
  verifyAccountWithOtp: (otp: string) => void;
  isVerifingOtp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uiBlocked, setUiBlocked] = useState<boolean>(false);
  const [isGoogleProcessing, setIsGoogleProcessing] = useState<boolean>(false);
  const [isSignupOrLoginProcessing, setIsSignupOrLoginProcessing] =
    useState<boolean>(false);
  const [isVerifingOtp, setIsVerifingOtp] = useState<boolean>(false);

  const [actionType, setActionType] = useState<"signup" | "login">("signup");
  const [formInput, setFormInput] = useState<FormInput>({
    name: "",
    email: "",
    password: "",
  });
  const [fieldsError, setFieldsError] = useState<any>({});

  const router = useRouter();

  const handleInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldsError((prev: any) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUiBlocked(true);
    setIsSignupOrLoginProcessing(true);

    try {
      const res = await api.post(`/api/auth/${actionType}`, {
        name: formInput.name,
        email: formInput.email,
        password: formInput.password,
      });

      if (res.statusText === "OK") {
        if (actionType === "login") {
          router.replace("");
        } else {
          router.push("/verify");
        }
      }
    } catch (error) {
      if (!(error instanceof AxiosError)) throw error;
      if (error.response?.status === 422) {
        setFieldsError(error.response.data?.errors);
      }
    } finally {
      setUiBlocked(false);
      setIsSignupOrLoginProcessing(false);
    }
  };

  const googleResponse = async (
    authResult: GoogleAuthResult,
  ): Promise<void> => {
    if (!authResult || !authResult.code) {
      setUiBlocked(false);
      return;
    }
    setUiBlocked(true);
    setIsGoogleProcessing(true);
    try {
      const res = await api.post(
        `/api/auth/google?code=${encodeURIComponent(authResult.code)}`,
      );
      if (res.status === 201 || res.status === 200) {
        router.replace("/profile");
        return;
      }
    } catch (err: any) {
      console.error("AuthErr:", err);
    } finally {
      setUiBlocked(false);
      setIsGoogleProcessing(false);
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
    if (isGoogleProcessing) return;
    setUiBlocked(true);
    googleLogin();
  };

  const verifyAccountWithOtp = async (otp: string) => {
    setIsVerifingOtp(true);
    try {
      const res = await api.post("/api/auth/verify", { otp });
      if (res.status === 200) {
        toast.success(res.data.message);

        // Clear otp cookie here
        document.cookie =
          "otp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

        router.replace("/profile");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    } finally {
      setIsVerifingOtp(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        uiBlocked,
        isGoogleProcessing,
        isSignupOrLoginProcessing,
        isVerifingOtp,
        loginWithGoogle,
        actionType,
        setActionType,
        handleInput,
        formInput,
        handleSubmit,
        fieldsError,
        verifyAccountWithOtp,
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
