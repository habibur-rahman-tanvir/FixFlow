import type { RequestHandler } from "express";
import { UserModel } from "../model/user.model.js";
import { AppError } from "../error/App.error.js";
import { name } from "nodemailer/lib/package-info.js";

export const getProfileBasic: RequestHandler = async (req, res) => {
  const user = await UserModel.findOne({ _id: req.user!._id })
    .select({
      _id: 1,
      name: 1,
      email: 1,
      role: 1,
      userStatus: 1,
    })
    .lean();

  if (!user) throw new AppError("User not found", 404);

  res.json(user);
};
