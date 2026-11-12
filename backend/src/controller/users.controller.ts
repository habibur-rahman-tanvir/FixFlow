import type { RequestHandler } from "express";
import { UserModel } from "../model/user.model.js";
import { parseQueryInteger } from "../utils/util.js";

const SORT_FIELDS = ["name", "email", "createdAt", "updatedAt"] as const;
const ORDER_FIELDS = ["asc", "desc"] as const;
const ROLE_FIELDS = [
  "visitor",
  "member",
  "admin",
  "manager",
  "technician",
] as const;

type SortField = (typeof SORT_FIELDS)[number];
type OrderField = (typeof ORDER_FIELDS)[number];
type RoleField = (typeof ROLE_FIELDS)[number];

export const getUsers: RequestHandler = async (req, res) => {
  const skip = parseQueryInteger(req.query.skip, 0);
  const requestedLimit = parseQueryInteger(req.query.limit, 10);
  const limit = Math.min(Math.max(requestedLimit, 1), 50);

  const rawSortBy = req.query.sortBy;
  const rawOrder = req.query.order;
  const rawSearch = req.query.search;
  const rawRole = req.query.role;

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

  const searchValue = Array.isArray(rawSearch) ? rawSearch[0] : rawSearch;
  const rawRoleValues = Array.isArray(rawRole)
    ? rawRole
    : typeof rawRole === "string"
      ? rawRole.split(",")
      : [];

  const search = typeof searchValue === "string" ? searchValue.trim() : "";
  const roles = rawRoleValues
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter((value): value is RoleField =>
      ROLE_FIELDS.includes(value as RoleField),
    );

  const filter: Record<string, unknown> = {};

  if (roles.length > 0) {
    filter.role = { $in: roles };
  }

  if (search) {
    filter.name = {
      $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: direction,
    _id: direction,
  };

  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .select("-password")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    UserModel.countDocuments(filter),
  ]);

  return res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
    pagination: {
      total,
      skip,
      limit,
      hasNextPage: skip + users.length < total,
    },
  });
};
