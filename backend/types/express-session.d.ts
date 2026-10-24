import "express-session";
import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    user?: {
      _id: mongoose.Types.ObjectId;
      email: string;
      role: "visitor" | "member" | "admin" | "manager" | "technician";
    };
  }
}
