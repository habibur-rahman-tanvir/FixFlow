import mongoose, { type HydratedDocument } from "mongoose";
import { UserModel } from "../model/user.model.js";
import { AppError } from "../error/App.error.js";
import { OrganizationModel } from "../model/organization.model.js";
import { normalizeObjectId, normalizeText } from "../utils/util.js";

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  createdBy: string | mongoose.Types.ObjectId;

  managerId?: string | mongoose.Types.ObjectId | undefined;
  description?: string | undefined;
  timezone?: string | undefined;
};

export const createOrganization = async (input: CreateOrganizationInput) => {
  const _name = normalizeText(input.name);
  const _slug = normalizeText(input.slug);
  const _createdBy = normalizeObjectId(input.createdBy);

  const _managerId = normalizeObjectId(input.managerId);
  const _description = normalizeText(input.description);
  const _timezone = normalizeText(input.timezone);

  if (!_slug || _slug.length < 2) {
    throw new AppError(
      "Organization slug is required and must be at least 2 characters long",
      400,
    );
  }
  if (!_name || _name.length < 2) {
    throw new AppError(
      "Organization name is required and must be at least 2 characters long",
      400,
    );
  }
  if (!_createdBy) throw new AppError("Creator id not found", 404);

  const session = await mongoose.startSession();

  try {
    let organization;

    await session.withTransaction(async () => {
      const existingOrganization = await OrganizationModel.findOne({
        slug: _slug,
      })
        .session(session)
        .lean();
      if (existingOrganization) {
        throw new AppError("Organization slug already exists", 409);
      }

      const creator = await UserModel.findById(_createdBy)
        .session(session)
        .lean();
      if (!creator) {
        throw new AppError("Creator user not found", 404);
      }

      if (_managerId) {
        const preferredManager = await UserModel.findOne({
          _id: _managerId,
        })
          .session(session)
          .lean();

        if (!preferredManager) {
          throw new AppError("Manager user not found", 404);
        }

        if (!["manager", "visitor"].includes(preferredManager.role)) {
          throw new AppError(
            "Only 'visitor' or 'manager' can be a manager",
            400,
          );
        }
      }

      const orgDoc = {
        name: _name,
        slug: _slug,
        createdBy: _createdBy,
        ...(_managerId && { manager: _managerId }),
        ...(_description && { description: _description }),
        ...(_timezone && { timezone: _timezone }),
      };

      const result = await OrganizationModel.create([orgDoc], {
        session,
      });
      const savedOrganization = result[0];

      if (!savedOrganization) {
        throw new AppError("Organization could not be created", 500);
      }

      organization = savedOrganization;

      if (_managerId) {
        const updateResult = await UserModel.updateOne(
          { _id: _managerId },
          {
            $addToSet: { managerOf: savedOrganization._id },
            $set: { role: "manager" },
          },
          { session },
        );
        if (updateResult.matchedCount !== 1) {
          throw new AppError("Manager user could not be updated", 500);
        }
      }
    });

    return organization;
  } finally {
    await session.endSession();
  }
};
