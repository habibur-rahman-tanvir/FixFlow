import express, { Router } from "express";
import {
  createOrgController,
  getOrgByIdOrSlug,
  getOrgController,
} from "../controller/org.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const orgRouter: Router = express.Router();

orgRouter.get("/:orgIdOrSlug", verifyAccess(), getOrgByIdOrSlug);
orgRouter.get("/", verifyAccess(), getOrgController);
orgRouter.post("/", verifyAccess(["admin"]), createOrgController);

export default orgRouter;
