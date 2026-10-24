import { AppError } from "../error/App.error.js";
import { User } from "../model/user.model.js";

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const safeName = name.trim();
  const safeEmail = email.trim().toLowerCase();

  if (!safeName || !safeEmail || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }

  // const existingUser = await User.findOne({ email: safeEmail }).lean();

  // if (existingUser) {
  //   throw new AppError("Email already registered", 409);
  // }

  const user = await User.create({
    name: safeName,
    email: safeEmail,
    hashedPass: password,
  });

  console.log("New User created");

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
