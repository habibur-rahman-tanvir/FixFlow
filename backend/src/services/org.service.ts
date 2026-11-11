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

export type AssignManagerInput = {
  organizationId: string | mongoose.Types.ObjectId;
  managerId: string | mongoose.Types.ObjectId;
};

export type RemoveManagerInput = {
  organizationId: string | mongoose.Types.ObjectId;
};

export const assignManagerToOrganization = async ({
  organizationId,
  managerId,
}: AssignManagerInput) => {
  const _organizationId = normalizeObjectId(organizationId);
  const _managerId = normalizeObjectId(managerId);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  if (!_managerId) {
    throw new AppError("Manager id is required", 400);
  }

  const session = await mongoose.startSession();

  try {
    let updatedOrganization;

    await session.withTransaction(async () => {
      const organization = await OrganizationModel.findById(_organizationId)
        .session(session)
        .lean();

      if (!organization) {
        throw new AppError("Organization not found", 404);
      }

      const previousManagerId = organization.manager?.toString();

      if (previousManagerId && previousManagerId !== _managerId.toString()) {
        throw new AppError(
          "Remove the current manager before assigning a new one",
          409,
        );
      }

      if (previousManagerId === _managerId.toString()) {
        updatedOrganization = await OrganizationModel.findById(_organizationId)
          .populate({ path: "manager", select: "-password" })
          .populate({ path: "createdBy", select: "-password" })
          .lean();
        return;
      }

      const manager = await UserModel.findById(_managerId)
        .session(session)
        .lean();

      if (!manager) {
        throw new AppError("Manager user not found", 404);
      }

      // const allowedRoles = ["visitor", "member", "manager"] as const;
      const allowedRoles = ["visitor", "manager"] as const;
      if (
        !allowedRoles.includes(manager.role as (typeof allowedRoles)[number])
      ) {
        throw new AppError(
          // "Only visitor, member, or manager roles can be assigned to an organization",
          "Only visitor or manager roles can be assigned to an organization",
          400,
        );
      }

      const result = await OrganizationModel.findByIdAndUpdate(
        _organizationId,
        { manager: _managerId },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
        .populate({ path: "manager", select: "-password" })
        .populate({ path: "createdBy", select: "-password" });

      if (!result) {
        throw new AppError("Organization could not be updated", 500);
      }

      await UserModel.updateOne(
        { _id: _managerId },
        {
          $addToSet: { managerOf: _organizationId },
          $set: { role: "manager" },
        },
        { session },
      );

      updatedOrganization = result.toObject ? result.toObject() : result;
    });

    return updatedOrganization;
  } finally {
    await session.endSession();
  }
};

export const removeManagerFromOrganization = async ({
  organizationId,
}: RemoveManagerInput) => {
  const _organizationId = normalizeObjectId(organizationId);

  if (!_organizationId) {
    throw new AppError("Organization id is required", 400);
  }

  const session = await mongoose.startSession();

  try {
    let updatedOrganization;

    await session.withTransaction(async () => {
      const organization = await OrganizationModel.findById(_organizationId)
        .session(session)
        .lean();

      if (!organization) {
        throw new AppError("Organization not found", 404);
      }

      if (!organization.manager) {
        throw new AppError("No manager assigned to this organization", 400);
      }

      const previousManagerId = organization.manager.toString();

      const result = await OrganizationModel.findByIdAndUpdate(
        _organizationId,
        { $unset: { manager: "" } },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
        .populate({ path: "manager", select: "-password" })
        .populate({ path: "createdBy", select: "-password" });

      if (!result) {
        throw new AppError("Organization manager could not be removed", 500);
      }

      await UserModel.updateOne(
        { _id: previousManagerId },
        { $pull: { managerOf: _organizationId } },
        { session },
      );

      updatedOrganization = result.toObject ? result.toObject() : result;
    });

    return updatedOrganization;
  } finally {
    await session.endSession();
  }
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
