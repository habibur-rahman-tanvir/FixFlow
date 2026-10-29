"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyPage() {
  const [otp, setOtp] = useState("");
  const { verifyAccountWithOtp, isVerifingOtp } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(
        new RegExp(`(?:^|; )${name}=([^;]*)`),
      );
      if (!match) return null;
      const raw = decodeURIComponent(match[1]);
      return JSON.parse(raw);
    };
    const otp = getCookie("otp");
    if (!otp || otp.expireAt < Date.now()) {
      router.replace("/signup");
    }
  }, [router]);

  return (
    <div className="h-dvh flex justify-center items-center">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:{" "}
            <span className="font-medium">m@example.com</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button variant="outline" size="xs">
                <RefreshCwIcon />
                Resend Code
              </Button>
            </div>
            <InputOTP
              onChange={(value) => {
                setOtp(value.replace(/[^0-9]/g, "").slice(0, 6));
              }}
              value={otp}
              pattern="[0-9]"
              maxLength={6}
              id="otp-verification"
              required
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              <a href="#">I no longer have access to this email address.</a>
            </FieldDescription>
          </Field>
        </CardContent>
        <CardFooter>
          <Field>
            <Button
              disabled={otp.length < 6 || isVerifingOtp}
              type="submit"
              className="w-full disabled:bg-black/65"
              onClick={() => verifyAccountWithOtp(otp)}
            >
              Verify {isVerifingOtp && <Spinner />}
            </Button>
            <div className="text-sm text-muted-foreground">
              Having trouble signing in?{" "}
              <a
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                Contact support
              </a>
            </div>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
