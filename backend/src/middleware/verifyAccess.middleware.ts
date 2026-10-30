import type { RequestHandler } from "express";
import type { Role, UserStatus } from "../dto/user/user.dto.js";
import jwt, { type JwtPayload as JsonwebtokenJwtPayload } from "jsonwebtoken";

const verifyAccess = (
  roleArr?: Role[],
  userStatue?: UserStatus[],
): RequestHandler => {
  let roles: Role[] = ["visitor", "member", "admin", "manager", "technician"];
  let statuses: UserStatus[] = ["active", "suspended", "deleted"];
  const secret = process.env.JWT_SECRET || "JWT_SECRET";

  if (Array.isArray(roleArr) && roleArr.length > 0) {
    roles = roleArr;
  }

  if (Array.isArray(userStatue) && userStatue.length > 0) {
    statuses = userStatue;
  }

  return (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      [, token] = req.headers.authorization.split(" ");
    }

    if (!token) return res.status(401).set("X-Token-Expired", "true").end();

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return res.status(401).set("X-Token-Expired", "true").end();
    }

    if (
      !(roles.includes(decoded.role) && statuses.includes(decoded.userStatus))
    )
      return res
        .status(403)
        .json({ message: "You have no permission to access" });

    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      userStatus: decoded.userStatus,
    };

    next();
  };
};

export default verifyAccess;
