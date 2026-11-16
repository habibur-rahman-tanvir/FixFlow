export const USER_ROLES = [
  "visitor",
  "member",
  "admin",
  "manager",
  "technician",
] as const;

export type Role = (typeof USER_ROLES)[number];
export type UserStatus = "active" | "suspended" | "deleted";
export type VerifiedBy = "email" | "google";

export type User = {
  _id: string;
  name: string;
  email: string;

  role: Role;
  userStatus: UserStatus;
  verifiedBy?: VerifiedBy;

  avatar?: {
    url: string;
    publicId?: string;
  } | null;

  managerOf?: string[];
  technicianOf?: string[];
  memberOf?: string | null;

  createdAt?: string;
  updatedAt?: string;
};

export type UserBasic = Pick<
  User,
  "_id" | "name" | "email" | "role" | "userStatus"
>;
