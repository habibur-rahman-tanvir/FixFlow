import type { RequestHandler } from "express";
import { createOrganization } from "../services/org.service.js";
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
