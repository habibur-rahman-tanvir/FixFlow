import mongoose from "mongoose";

interface User {
  name: string;
  email: string;
  password?: string;
  verifiedBy: "email" | "google";
  avatar?: {
    url: string;
    publicId: string;
  } | null;
  userStatus: "active" | "suspended" | "deleted";
  role: "visitor" | "member" | "admin" | "manager" | "technician";
  managerOf: mongoose.Types.ObjectId[];
  technicianOf: mongoose.Types.ObjectId[];
  memberOf?: mongoose.Types.ObjectId | null;
}

export type { User };
