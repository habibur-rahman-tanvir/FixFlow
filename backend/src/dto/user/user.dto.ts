import mongoose from "mongoose";

export const ROLE = [
  "visitor",
  "member",
  "admin",
  "manager",
  "technician",
] as const;
export const ROLE_DEFAULT = ROLE[0];

export const USER_STATUS = ["active", "suspended", "deleted"] as const;
export const USER_STATUS_DEFAULT = USER_STATUS[0];

export const VERIFIED_BY = ["email", "google"] as const;

export type Role = (typeof ROLE)[number];
export type UserStatus = (typeof USER_STATUS)[number];
export type VerifiedBy = (typeof VERIFIED_BY)[number];

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
