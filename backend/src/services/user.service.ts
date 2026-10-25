import { UserModel } from "../model/user.model.js";

type UserInput =
  | {
      name: string;
      email: string;
      verifiedBy: "email";
      password: string;
    }
  | {
      name: string;
      email: string;
      verifiedBy: "google";
      password?: string;
    };

export const createUser = async ({
  name,
  email,
  verifiedBy,
  password,
}: UserInput) => {
  const safeName = name.trim();
  const safeEmail = email.trim().toLowerCase();

  // TODO: validate

  const existingUser = await UserModel.findOne({
    email: safeEmail,
    verifiedBy,
  });

  const query: any = {
    name: safeName,
    email: safeEmail,
    verifiedBy: verifiedBy,
  };
  if (verifiedBy === "email") query.password = password;

  const user = existingUser ?? (await UserModel.create(query));

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
  };
};
