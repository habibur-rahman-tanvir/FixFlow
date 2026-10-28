import { response, type RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../error/App.error.js";
import { createUser } from "../services/user.service.js";
import { UserModel } from "../model/user.model.js";
import jwt from "jsonwebtoken";
import {
  JWT_EXPIRE_TIME_MINUTES,
  OTP_EXPIRE_TIME_MINUTE,
} from "../config/config.js";
import { oauth2client } from "../config/google.config.js";
import axios from "axios";
import { createOPT } from "../utils/util.js";
import { emailQueue } from "../config/queue.js";

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
    const { name, email, password } = signupSchema.parse(req.body);

    const otp = createOPT();

    req.session.otp = { name, email, password, otp };
    const expireAt = Date.now() + 1000 * 60 * OTP_EXPIRE_TIME_MINUTE;

    res.cookie("otp", JSON.stringify({ expireAt }), {
      maxAge: 1000 * 60 * OTP_EXPIRE_TIME_MINUTE,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    // await emailQueue.add("anyName", { name, email, otp });

    res.json({
      status: "success",
      message: "We sent an verification otp/link in your email.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const flattenError = error.issues.reduce(
        (acc, current) => {
          acc[current.path.join(".")] = current.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return res.status(422).json({
        status: "fail",
        message: "Validation failed",
        errors: flattenError,
      });
    }
    return next(error);
  }
};

export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body || {};
  // TODO: validate email and password
  const user = await UserModel.findOne({ email });
  if (!user || !(await user.verifyPassword(password))) {
    throw new AppError("Inavlid email or password", 401);
  }
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
  };
  res.json({
    status: "success",
    message: "Login successful",
  });
};

export const logoutController: RequestHandler = async (req, res) => {
  req.session.destroy((err) => {
    if (err) throw new AppError("Something went wrong");
    res.clearCookie("connect.sid");
    return res.json({
      status: "success",
      message: "Logout successfull",
    });
  });
};

export const googleAuthController: RequestHandler = async (req, res) => {
  const { code } = req.query;
  if (!code) throw new AppError("Google auth code not found", 400);
  try {
    const googleRes = await oauth2client.getToken(code as string);
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        params: {
          access_token: googleRes.tokens.access_token,
        },
      },
    );

    const { name, email } = userRes.data;
    // TODO: validate

    const user = await createUser({ name, email, verifiedBy: "google" });

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userStatus: user.userStatus,
    };

    return res.status(201).json({
      status: "success",
      message: "Google login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userStatus: user.userStatus,
      },
    });
  } catch (err) {
    console.log("Err:", err);
    throw new AppError("Google authentication failed", 401);
  }
};

export const refreshAccessToken: RequestHandler = async (req, res) => {
  if (!req.session.user) throw new AppError("User not signed in", 401);
  const secret = process.env.JWT_SECRET || "JWT_SECRET";
  const token = jwt.sign(
    {
      _id: req.session.user?._id,
      email: req.session.user?.email,
      role: req.session.user.role,
    },
    secret,
    {
      noTimestamp: true,
      expiresIn: 60 * JWT_EXPIRE_TIME_MINUTES,
    },
  );
  res.setHeader("X-Access-Token", token);
  res.status(200).json({
    status: "success",
    accessToken: token,
  });
};
