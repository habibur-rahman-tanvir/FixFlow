import express, { Router } from "express";
import { getProfileBasic } from "../controller/profile.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const profileRouter: Router = express.Router();

profileRouter.get("/basic", verifyAccess(), getProfileBasic);

export default profileRouter;
