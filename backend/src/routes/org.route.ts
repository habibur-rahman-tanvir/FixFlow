import express, { Router } from "express";
import {
  assignManager,
  createIssueCategory,
  createOrgController,
  getIssueCategories,
  getOrgByIdOrSlug,
  getOrgController,
  removeManager,
} from "../controller/org.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";

const orgRouter: Router = express.Router();

orgRouter.post("/:orgId/issue/category", verifyAccess(), createIssueCategory);
orgRouter.get("/:orgId/issue/category", verifyAccess(), getIssueCategories);

orgRouter.get("/:orgIdOrSlug", verifyAccess(), getOrgByIdOrSlug);

orgRouter.post("/:orgId/manager", verifyAccess(["admin"]), assignManager);
orgRouter.delete("/:orgId/manager", verifyAccess(["admin"]), removeManager);

orgRouter.get("/", verifyAccess(), getOrgController);
orgRouter.post("/", verifyAccess(["admin"]), createOrgController);

export default orgRouter;
