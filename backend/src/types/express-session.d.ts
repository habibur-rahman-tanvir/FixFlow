import "express-session";
import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: mongoose.Types.ObjectId;
      name: string;
      email: string;
      role: "visitor" | "member" | "admin" | "manager" | "technician";
      userStatus: "active" | "suspended" | "deleted";
    };
    otp?: {
      name: string;
      email: string;
      password: string;
      otp: string;
      otpAttemp?: number;
      expiresAt: number;
    };
  }
}
