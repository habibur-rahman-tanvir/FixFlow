import express, { Router } from "express";
import {
  createOrgController,
  getOrgController,
} from "../controller/org.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const orgRouter: Router = express.Router();

orgRouter.get("/", verifyAccess(), getOrgController);
orgRouter.post("/", verifyAccess(["admin"]), createOrgController);

export default orgRouter;
