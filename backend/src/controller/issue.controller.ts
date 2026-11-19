import type { RequestHandler } from "express";
import {
  createIssueCategoryForOrg,
  getIssueCategoriesForOrg,
} from "../services/issueCategory.service.js";

export const createIssueCategory: RequestHandler = async (req, res, next) => {
  try {
    const rawOrgId = req.params.orgId;
    const organizationId: string = Array.isArray(rawOrgId)
      ? (rawOrgId[0] ?? "")
      : (rawOrgId ?? "");

    const createdBy = req.user?._id!;
    const role = req.user?.role!;

    const { name, description, priority, isActive } = req.body ?? {};

    const issueCategory = await createIssueCategoryForOrg({
      organizationId,
      role,
      createdBy,
      name,
      description,
      priority,
      isActive,
    });

    return res.status(201).json({
      status: "success",
      message: "Issue category created successfully",
      data: issueCategory,
    });
  } catch (error) {
    return next(error);
  }
};

export const getIssueCategories: RequestHandler = async (req, res, next) => {
  try {
    const rawOrgId = req.params.orgId;
    const organizationId: string = Array.isArray(rawOrgId)
      ? (rawOrgId[0] ?? "")
      : (rawOrgId ?? "");

    const categories = await getIssueCategoriesForOrg({
      organizationId,
      includeInactive: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Issue categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
};
