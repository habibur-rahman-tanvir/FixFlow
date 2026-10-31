"use client";

import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "../../(guards)/protected-route";
import { useAuth } from "@/context/auth/AuthContext";

export default function LogoutPage() {
  const { handleLogout, uiBlocked } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-dvh flex justify-center items-center">
        <div>
          <Button
            onClick={handleLogout}
            disabled={uiBlocked}
            variant={"destructive"}
            className="disabled:opacity-40"
          >
            Logout
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
