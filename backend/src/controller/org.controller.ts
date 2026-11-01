import type { RequestHandler } from "express";
import { createOrganization } from "../services/org.service.js";
import { AppError } from "../error/App.error.js";

export const getOrgController: RequestHandler = async (req, res) => {
  res.send("All Org");
};

export const createOrgController: RequestHandler = async (req, res) => {
  const createdBy = req.user?._id;

  if (!createdBy) {
    throw new AppError("Authentication required", 401);
  }

  const { name, slug, managerId, description, timezone } = req.body ?? {};

  const organization = await createOrganization({
    name,
    slug,
    createdBy,
    managerId,
    description,
    timezone,
  });

  return res.status(201).json({
    status: "success",
    message: "Organization created successfully",
    data: organization,
  });
};
