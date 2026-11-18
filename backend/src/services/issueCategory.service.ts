import mongoose from "mongoose";
import { AppError } from "../error/App.error.js";
import { IssueCategoryModel } from "../model/issueCategory.model.js";
import { OrganizationModel } from "../model/organization.model.js";
import { UserModel } from "../model/user.model.js";
import { normalizeObjectId, normalizeText } from "../utils/util.js";
import type { Role } from "../dto/user/user.dto.js";

export const ISSUE_CATEGORY_PRIORITY = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export type IssueCategoryPriority = (typeof ISSUE_CATEGORY_PRIORITY)[number];

export type CreateIssueCategoryProps = {
  organizationId: string | mongoose.Types.ObjectId;
  role: Role;
  createdBy: string | mongoose.Types.ObjectId;

  name: string;
  description?: string;
  priority?: IssueCategoryPriority | string;
  isActive?: boolean;
};

export type GetIssueCategoriesInput = {
  organizationId: string | mongoose.Types.ObjectId;
  includeInactive?: boolean;
};

const normalizePriority = (
  priority?: IssueCategoryPriority | string,
): IssueCategoryPriority => {
  const normalizedPriority = normalizeText(priority);

  if (!normalizedPriority) {
    return "MEDIUM";
  }

  const upperPriority = normalizedPriority.toUpperCase();

  if (
    ISSUE_CATEGORY_PRIORITY.includes(upperPriority as IssueCategoryPriority)
  ) {
    return upperPriority as IssueCategoryPriority;
  }

  throw new AppError(
    `Invalid priority. Allowed values: ${ISSUE_CATEGORY_PRIORITY.join(", ")}`,
    400,
  );
};

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
};

const createUniqueSlug = async (
  organizationId: mongoose.Types.ObjectId,
  name: string,
) => {
  const baseSlug = slugify(name);

  if (!baseSlug) {
    throw new AppError(
      "Issue category name is required and must contain valid characters",
      400,
    );
  }

  let slug = baseSlug;
  let counter = 1;

  while (
    await IssueCategoryModel.exists({ organization: organizationId, slug })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const ensureOrganizationManagerAccess = async ({
  organizationId,
  userId,
}: {
  organizationId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
}) => {
  const _organizationId = normalizeObjectId(organizationId);
  const _userId = normalizeObjectId(userId);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  if (!_userId) {
    throw new AppError("Authentication required", 401);
  }

  const [organization] = await Promise.all([
    OrganizationModel.findOne({ _id: _organizationId, manager: userId }).lean(),
  ]);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return organization;
};

export const createIssueCategoryForOrganization = async (
  input: CreateIssueCategoryProps,
) => {
  const _organizationId = normalizeObjectId(input.organizationId);
  const _createdBy = normalizeObjectId(input.createdBy);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  if (!_createdBy) {
    throw new AppError("Authentication required", 401);
  }

  if (input.role !== "admin") {
    await ensureOrganizationManagerAccess({
      organizationId: _organizationId,
      userId: _createdBy,
    });
  }

  const name = normalizeText(input.name);
  const description = normalizeText(input.description);
  const isActive = typeof input.isActive === "boolean" ? input.isActive : true;
  const priority = normalizePriority(input.priority);

  if (!name || name.length < 2) {
    throw new AppError(
      "Issue category name is required and must be at least 2 characters long",
      400,
    );
  }

  const slug = await createUniqueSlug(_organizationId, name);

  const categoryPayload = {
    organization: _organizationId,
    name,
    slug,
    priority,
    isActive,
    createdBy: _createdBy,
    ...(description ? { description } : {}),
  };

  const category = await IssueCategoryModel.create(categoryPayload);

  return category && typeof (category as any).toObject === "function"
    ? (category as any).toObject()
    : category;
};

export const getIssueCategoriesForOrganization = async ({
  organizationId,
  includeInactive = true,
}: GetIssueCategoriesInput) => {
  const _organizationId = normalizeObjectId(organizationId);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  const organization = await OrganizationModel.findById(_organizationId).lean();

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const query: Record<string, unknown> = { organization: _organizationId };

  if (!includeInactive) {
    query.isActive = true;
  }

  return IssueCategoryModel.find(query).sort({ isActive: -1, name: 1 }).lean();
};
