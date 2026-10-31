export type Role = "visitor" | "member" | "admin" | "manager" | "technician";
export type UserStatus = "active" | "suspended" | "deleted";
export type VerifiedBy = "email" | "google";

type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  userStatus: UserStatus;

  verifiedBy?: VerifiedBy;
  avatar?: {
    url: string;
  } | null;
  managerOf?: string[];
  technicianOf?: string[];
  memberOf?: string | null;
};

export type UserBasic = Pick<
  User,
  "_id" | "name" | "email" | "role" | "userStatus"
>;

export type { User };
