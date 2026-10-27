"use client";

import { useAuth } from "@/context/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const {
    isProcessing,
    loginWithGoogle,
    uiBlocked,
    actionType,
    setActionType,
  } = useAuth();

  return (
    <div className="flex h-dvh items-center justify-center p-4">
      <Card className="w-full max-w-sm transition-all duration-300 ease-in-out">
        <CardHeader>
          <CardTitle>
            {actionType === "login"
              ? "Login to your account"
              : "Create a new account"}
          </CardTitle>

          <CardDescription>
            Enter your info below to{" "}
            {actionType === "login" ? "login to your" : "create a new"} account
          </CardDescription>

          <CardAction>
            <Button
              variant="link"
              className="transition-all duration-200 ease-in-out"
              onClick={() =>
                setActionType((prev) =>
                  prev === "signup" ? "login" : "signup",
                )
              }
            >
              {actionType === "signup" ? "Login" : "Sign Up"}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {/* Animated Name Field */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  actionType === "signup"
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid gap-2 pb-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      required={actionType === "signup"}
                      tabIndex={actionType === "signup" ? 0 : -1}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 transition-colors duration-200 hover:underline"
                  >
                    {actionType === "login" && "Forgot your password?"}
                  </a>
                </div>

                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full transition-all duration-200 ease-in-out"
          >
            {actionType === "signup" ? "Create" : "Login"}
          </Button>

          <Button
            variant="outline"
            className="w-full transition-all duration-200 ease-in-out disabled:opacity-55"
            onClick={loginWithGoogle}
            disabled={uiBlocked}
          >
            Login with Google {isProcessing && "..."}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
