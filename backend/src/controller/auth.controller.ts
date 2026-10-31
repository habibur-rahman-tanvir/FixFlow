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
import type { JwtPayload } from "../dto/jwt/jwt.dto.js";

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
    const expiresAt = Date.now() + 1000 * 60 * OTP_EXPIRE_TIME_MINUTE;

    req.session.otp = {
      name,
      email,
      password,
      otp,
      otpAttemp: 0,
      expiresAt,
    };

    res.cookie("otp", JSON.stringify({ expireAt: expiresAt }), {
      maxAge: 1000 * 60 * OTP_EXPIRE_TIME_MINUTE,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });

    await emailQueue.add("otpQueue", { name, email, otp });
    res.json({
      status: "success",
      message: "We sent an verification otp in your email.",
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

const isOtpExpired = (expiresAt?: number) => {
  if (!expiresAt) return true;
  return Date.now() > expiresAt;
};

export const verifyOtpController: RequestHandler = async (req, res, next) => {
  try {
    const { otp } = req.body;

    if (!req.session.otp) {
      throw new AppError("You have no OTP session here", 400);
    }

    if (isOtpExpired(req.session.otp.expiresAt)) {
      delete req.session.otp;
      throw new AppError("OTP has expired. Please signup again.", 410);
    }

    const { name, email, password, otp: sessionOtp } = req.session.otp;

    if (String(otp) !== String(sessionOtp)) {
      throw new AppError("Your OTP not match", 400);
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.role === "admin")
      throw new AppError("Admin can't signup (change it later)", 400);

    const savedUser = existingUser
      ? await (async () => {
          existingUser.name = name;
          existingUser.password = password;
          existingUser.verifiedBy = "email";
          return existingUser.save();
        })()
      : await createUser({ name, email, password, verifiedBy: "email" });

    if (!savedUser) {
      throw new AppError("User could not be created", 500);
    }

    req.session.user = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      userStatus: savedUser.userStatus,
    };

    delete req.session.otp;

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return res.json({
      status: "success",
      message: "Your account verified successfully",
      data: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        userStatus: savedUser.userStatus,
      },
    });
  } catch (error) {
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
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      userStatus: user.userStatus,
    },
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

  const jwtPayload: JwtPayload = {
    _id: req.session.user?._id,
    email: req.session.user?.email,
    role: req.session.user.role,
    userStatus: req.session.user.userStatus,
  };

  const token = jwt.sign(jwtPayload, secret, {
    noTimestamp: true,
    expiresIn: 60 * JWT_EXPIRE_TIME_MINUTES,
  });
  res.setHeader("X-Access-Token", token);
  res.status(200).json({
    status: "success",
    accessToken: token,
  });
};
