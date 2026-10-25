import express, { Router } from "express";
import {
  refreshAccessToken,
  googleAuthController,
  loginController,
  logoutController,
  signupController,
} from "../controller/auth.controller.js";
import userSession from "../config/session.js";

const authRouter: Router = express.Router();

authRouter.use(userSession);

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.post("/google", googleAuthController);
authRouter.post("/logout", logoutController);

authRouter.post("/refresh", refreshAccessToken);

export default authRouter;
