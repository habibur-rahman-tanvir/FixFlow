import express, { Router } from "express";
import {
  refreshAccessToken,
  googleAuthController,
  loginController,
  logoutController,
  signupController,
} from "../controller/auth.controller.js";

const authRouter: Router = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/google-auth", googleAuthController);
authRouter.post("/logout", logoutController);

authRouter.post("/refresh", refreshAccessToken);

export default authRouter;
