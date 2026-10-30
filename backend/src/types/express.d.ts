import { Types } from "mongoose";
import type { Role, UserStatus } from "../dto/user/user.dto.ts";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId | string;
        email: string;
        role: Role;
        userStatus: UserStatus;
        [key: string]: any;
      };
    }
  }
}
