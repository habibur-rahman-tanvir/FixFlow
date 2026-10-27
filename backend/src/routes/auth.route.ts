import express, { Router } from "express";
import {
  refreshAccessToken,
  googleAuthController,
  loginController,
  logoutController,
  signupController,
} from "../controller/auth.controller.js";
import userSession from "../config/user.session.js";
import otpSession from "../config/otp.session.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", otpSession, signupController);
authRouter.post("/login", userSession, loginController);
authRouter.post("/google", userSession, googleAuthController);
authRouter.post("/logout", userSession, logoutController);

authRouter.post("/refresh", userSession, refreshAccessToken);

export default authRouter;
