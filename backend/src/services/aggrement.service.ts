import type mongoose from "mongoose";
import { normalizeObjectId, slugify } from "../utils/util.js";
import { AppError } from "../error/App.error.js";
import { IssueCategoryModel } from "../model/issueCategory.model.js";
import { OrganizationModel } from "../model/organization.model.js";

export const createSlugForIssueCategory = async (
  orgId: mongoose.Types.ObjectId,
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

  while (await IssueCategoryModel.exists({ organization: orgId, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const ensureOrgManagerAccess = async ({
  orgId,
  userId,
}: {
  orgId: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
}) => {
  const _organizationId = normalizeObjectId(orgId);
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
