import express, { Router } from "express";
import {
  assignManager,
  createOrgController,
  getOrgByIdOrSlug,
  getOrgController,
} from "../controller/org.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const orgRouter: Router = express.Router();

orgRouter.get("/:orgIdOrSlug", verifyAccess(), getOrgByIdOrSlug);

orgRouter.post("/:orgId/manager", verifyAccess(), assignManager);
orgRouter.delete("/:orgId/manager", verifyAccess(), assignManager);

orgRouter.get("/", verifyAccess(), getOrgController);
orgRouter.post("/", verifyAccess(["admin"]), createOrgController);

export default orgRouter;
