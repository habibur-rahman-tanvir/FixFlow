"use client";

import { api } from "@/lib/axios/client";
// import { api } from "@/lib/axios/client";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function Home() {
  // const navigate = useNavigate();

  const googleResponse = async (authResult: any) => {
    try {
      const res = await api.post(`/api/auth/google?code=${authResult["code"]}`);
      if (res.status === 201) {
        // navigate("/", { replace: true });
        toast.success(JSON.stringify(res.data));
        console.log(res.data);
        return;
      }
    } catch (err: any) {
      console.log("AuthErr:", err);
      toast.error(err.message ? err.message : "Error in login");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  return (
    <div className="h-screen flex justify-center items-center">
      <button
        className="border p-1.5 shadow font-semibold rounded-xl active:scale-95"
        onClick={() => {
          googleLogin();
        }}
      >
        Login with Google
      </button>
    </div>
  );
}
