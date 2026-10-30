import express, { Router } from "express";
import { getProfile } from "../controller/profile.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const profileRouter: Router = express.Router();

profileRouter.get("/", verifyAccess(), getProfile);

export default profileRouter;
