import express, { Router } from "express";
import {
  assignManager,
  createOrgController,
  getOrgByIdOrSlug,
  getOrgController,
  removeManager,
} from "../controller/org.controller.js";
import verifyAccess from "../middleware/verifyAccess.middleware.js";
import {
  createIssueCategory,
  getIssueCategories,
} from "../controller/issue.controller.js";

const orgRouter: Router = express.Router();

orgRouter.post(
  "/:orgId/issue/category",
  verifyAccess(["admin", "manager"]),
  createIssueCategory,
);
orgRouter.get("/:orgId/issue/category", verifyAccess(), getIssueCategories);

orgRouter.get("/:orgIdOrSlug", verifyAccess(), getOrgByIdOrSlug);

orgRouter.post("/:orgId/manager", verifyAccess(["admin"]), assignManager);
orgRouter.delete("/:orgId/manager", verifyAccess(["admin"]), removeManager);

orgRouter.get("/", verifyAccess(), getOrgController);
orgRouter.post("/", verifyAccess(["admin"]), createOrgController);

export default orgRouter;
