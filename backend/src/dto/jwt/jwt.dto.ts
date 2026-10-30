import { type User } from "../user/user.dto.js";

export type JwtPayload = Pick<User, "_id" | "email" | "role" | "userStatus">;
