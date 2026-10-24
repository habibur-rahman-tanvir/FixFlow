import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../error/App.error.js";
import { createUser } from "../services/user.service.js";

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must be at most 100 characters long"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});

export const signupController: RequestHandler = async (req, res, next) => {
  try {
    const parsedBody = signupSchema.parse(req.body);

    const user = await createUser(
      parsedBody.name,
      parsedBody.email,
      parsedBody.password,
    );

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((issue) => issue.message).join(", ");
      return next(new AppError(message, 400));
    }

    return next(error);
  }
};

export const loginController: RequestHandler = async (req, res) => {
  res.send("Login user");
};

export const logoutController: RequestHandler = async (req, res) => {
  res.send("Logout user");
};

export const googleAuthController: RequestHandler = async (req, res) => {
  res.send("Google auth");
};

export const refreshAccessToken: RequestHandler = async (req, res) => {
  res.send("Refreshing access token");
};
