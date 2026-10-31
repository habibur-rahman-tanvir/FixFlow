import mongoose from "mongoose";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { envERROR } from "../utils/checkENV.js";
import { UserModel } from "../model/user.model.js";

const rl = createInterface({ input: stdin, output: stdout });

const { MONGODB_URI } = envERROR({ MONGODB_URI: process.env.MONGODB_URI });

try {
  await mongoose.connect(MONGODB_URI);

  const existingAdmin = await UserModel.exists({ role: "admin" });

  if (existingAdmin) {
    throw new Error("Platform admin already exists.");
  }

  const name = (await rl.question("Admin name: ")).trim();
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();

  const password = await rl.question("Initial password: ");

  if (!email || password.length < 8) {
    throw new Error(
      "Valid email and a sufficiently long password are required.",
    );
  }

  await UserModel.create({
    name,
    email,
    password,
    role: "admin",
    verifiedBy: "email",
    userStatus: "active",
  });

  console.log("Initial platform admin created.");
} finally {
  rl.close();
  await mongoose.disconnect();
}

// console.log("Hello");
