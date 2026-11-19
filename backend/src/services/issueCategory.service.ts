import mongoose from "mongoose";
import { AppError } from "../error/App.error.js";
import { IssueCategoryModel } from "../model/issueCategory.model.js";
import { OrganizationModel } from "../model/organization.model.js";
import { normalizeObjectId, normalizeText } from "../utils/util.js";
import type { Role } from "../dto/user/user.dto.js";
import {
  ISSUE_CATEGORY_PRIORITY,
  ISSUE_CATEGORY_PRIORITY_DEFAULT,
  type IssueCategoryPriority,
} from "../dto/issue/issueCategory.dto.js";
import {
  createSlugForIssueCategory,
  ensureOrgManagerAccess,
} from "./aggrement.service.js";

export type CreateIssueCategoryProps = {
  organizationId: string | mongoose.Types.ObjectId;
  role: Role;
  createdBy: string | mongoose.Types.ObjectId;

  name: string;
  description?: string;
  priority?: IssueCategoryPriority | string;
  isActive?: boolean;
};

export type GetIssueCategoriesProps = {
  organizationId: string | mongoose.Types.ObjectId;
  includeInactive?: boolean;
};

export const createIssueCategoryForOrg = async (
  props: CreateIssueCategoryProps,
) => {
  const _organizationId = normalizeObjectId(props.organizationId);
  const _createdBy = normalizeObjectId(props.createdBy);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  if (!_createdBy) {
    throw new AppError("Authentication required", 401);
  }

  if (props.role !== "admin") {
    await ensureOrgManagerAccess({
      orgId: _organizationId,
      userId: _createdBy,
    });
  }

  const name = normalizeText(props.name);
  const description = normalizeText(props.description);
  const isActive = typeof props.isActive === "boolean" ? props.isActive : true;
  let priority = normalizeText(
    props.priority,
  )?.toUpperCase() as IssueCategoryPriority;

  priority = ISSUE_CATEGORY_PRIORITY.includes(priority)
    ? priority
    : ISSUE_CATEGORY_PRIORITY_DEFAULT;

  if (!name || name.length < 2) {
    throw new AppError(
      "Issue category name is required and must be at least 2 characters long",
      400,
    );
  }

  const slug = await createSlugForIssueCategory(_organizationId, name);

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

  return category && typeof category.toObject === "function"
    ? category.toObject()
    : category;
};

export const getIssueCategoriesFromOrg = async ({
  organizationId,
  includeInactive = true,
}: GetIssueCategoriesProps) => {
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
