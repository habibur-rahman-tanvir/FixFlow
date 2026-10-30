import type { RequestHandler } from "express";
import { UserModel } from "../model/user.model.js";
import { AppError } from "../error/App.error.js";

export const getProfile: RequestHandler = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user!._id }).lean();
  if (!user) throw new AppError("User not found", 404);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
    avatar: user.avatar?.url,
  });
};
