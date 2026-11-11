import type { RequestHandler } from "express";
import mongoose from "mongoose";
import {
  assignManagerToOrganization,
  createOrganization,
  removeManagerFromOrganization,
} from "../services/org.service.js";
import { AppError } from "../error/App.error.js";
import { OrganizationModel } from "../model/organization.model.js";
import { parseQueryInteger } from "../utils/util.js";

const SORT_FIELDS = ["name", "slug", "createdAt", "updatedAt"] as const;
const ORDER_FIELDS = ["asc", "desc"] as const;

type SortField = (typeof SORT_FIELDS)[number];
type OrderField = (typeof ORDER_FIELDS)[number];

export const getOrgController: RequestHandler = async (req, res) => {
  const skip = parseQueryInteger(req.query.skip, 0);
  const requestedLimit = parseQueryInteger(req.query.limit, 10);
  const limit = Math.min(Math.max(requestedLimit, 1), 50);

  const rawSortBy = req.query.sortBy;
  const rawOrder = req.query.order;

  const sortBy: SortField =
    typeof rawSortBy === "string" &&
    SORT_FIELDS.includes(rawSortBy as SortField)
      ? (rawSortBy as SortField)
      : "createdAt";
  const order: OrderField =
    typeof rawOrder === "string" &&
    ORDER_FIELDS.includes(rawOrder as OrderField)
      ? (rawOrder as OrderField)
      : "desc";

  const direction: 1 | -1 = order === "asc" ? 1 : -1;

  const sort: Record<string, 1 | -1> = {
    [sortBy]: direction,
    _id: direction,
  };

  const [organizations, total] = await Promise.all([
    OrganizationModel.find().sort(sort).skip(skip).limit(limit).lean(),
    OrganizationModel.countDocuments(),
  ]);

  return res.status(200).json({
    status: "success",
    message: "Organizations fetched successfully",
    data: organizations,
    pagination: {
      total,
      skip,
      limit,
      hasNextPage: skip + organizations.length < total,
    },
  });
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

export const getOrgByIdOrSlug: RequestHandler = async (req, res) => {
  const rawOrgIdOrSlug = req.params.orgIdOrSlug;
  const orgIdOrSlug = Array.isArray(rawOrgIdOrSlug)
    ? rawOrgIdOrSlug[0]
    : rawOrgIdOrSlug;

  if (typeof orgIdOrSlug !== "string" || !orgIdOrSlug.trim()) {
    throw new AppError("Organization identifier is required", 400);
  }

  const normalizedOrgIdOrSlug = orgIdOrSlug.trim();
  const query = mongoose.Types.ObjectId.isValid(normalizedOrgIdOrSlug)
    ? { _id: normalizedOrgIdOrSlug }
    : { slug: normalizedOrgIdOrSlug.toLowerCase() };

  const organization = await OrganizationModel.findOne(query)
    .populate({
      path: "manager",
      select: "-password",
    })
    .populate({
      path: "createdBy",
      select: "-password",
    })
    .lean();

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return res.status(200).json({
    status: "success",
    message: "Organization fetched successfully",
    data: organization,
  });
};

export const assignManager: RequestHandler = async (req, res, next) => {
  try {
    const rawOrgId = req.params.orgId;
    const organizationId: string = Array.isArray(rawOrgId)
      ? (rawOrgId[0] ?? "")
      : (rawOrgId ?? "");
    const rawManagerId = req.body?.managerId;
    const managerId: string = Array.isArray(rawManagerId)
      ? (rawManagerId[0] ?? "")
      : typeof rawManagerId === "string"
        ? rawManagerId
        : "";

    if (!organizationId) {
      throw new AppError("Organization id is required", 400);
    }

    if (!managerId) {
      throw new AppError("Manager id is required", 400);
    }

    const organization = await assignManagerToOrganization({
      organizationId,
      managerId,
    });

    return res.status(200).json({
      status: "success",
      message: "Manager assigned successfully",
      data: organization,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeManager: RequestHandler = async (req, res, next) => {
  try {
    const rawOrgId = req.params.orgId;
    const organizationId: string = Array.isArray(rawOrgId)
      ? (rawOrgId[0] ?? "")
      : (rawOrgId ?? "");

    if (!organizationId) {
      throw new AppError("Organization id is required", 400);
    }

    const organization = await removeManagerFromOrganization({
      organizationId,
    });

    return res.status(200).json({
      status: "success",
      message: "Manager removed successfully",
      data: organization,
    });
  } catch (error) {
    return next(error);
  }
};
