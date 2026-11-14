export const USER_ROLES = [
  "visitor",
  "member",
  "admin",
  "manager",
  "technician",
] as const;

export const USER_STATUSES = ["active", "suspended", "deleted"] as const;

export type Role = (typeof USER_ROLES)[number];

export type UserStatus = (typeof USER_STATUSES)[number];

export type SortField = "name" | "email" | "createdAt" | "updatedAt";

export type SortOrder = "asc" | "desc";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  userStatus: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  avatar?: {
    url?: string;
    publicId?: string;
  } | null;
};

export type UsersQuery = {
  skip: number;
  limit: number;
  search?: string;
  role?: Role[];
  sortBy: SortField;
  order: SortOrder;
};

export type UsersPage = {
  users: User[];
  pagination: {
    total: number;
    skip: number;
    limit: number;
    hasNextPage: boolean;
  };
};

export type FetchUsers = (
  query: UsersQuery,
  signal: AbortSignal,
) => Promise<UsersPage>;
