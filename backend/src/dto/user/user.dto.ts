import mongoose from "mongoose";

export type Role = "visitor" | "member" | "admin" | "manager" | "technician";
export type UserStatus = "active" | "suspended" | "deleted";
export type VerifiedBy = "email" | "google";

interface User {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  role: Role;
  userStatus: UserStatus;
  password?: string;
  verifiedBy: VerifiedBy;
  avatar?: {
    url: string;
    publicId: string;
  } | null;
  managerOf: mongoose.Types.ObjectId[];
  technicianOf: mongoose.Types.ObjectId[];
  memberOf?: mongoose.Types.ObjectId | null;
}

export type UserBasic = Pick<
  User,
  "_id" | "name" | "email" | "role" | "userStatus"
>;

export type { User };
