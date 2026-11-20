import { Types } from "mongoose";
import { mongoStore } from "../config/user.session.js";

type UserSessionUpdates = {
  name?: string;
  email?: string;
  role?: string;
  userStatus?: string;
};

export const updateUserSessions = async (
  userId: string | Types.ObjectId,
  updates: UserSessionUpdates,
) => {
  const normalizedId = userId.toString();

  if (!Types.ObjectId.isValid(normalizedId)) {
    throw new Error("Invalid user ID");
  }

  const fields: Record<string, unknown> = {};

  // TODO: validate user email role and status
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields[`session.user.${key}`] = value;
    }
  }

  if (Object.keys(fields).length === 0) {
    return 0;
  }

  const collection = await mongoStore.collectionP;

  const result = await collection.updateMany(
    {
      "session.user._id": {
        $in: [new Types.ObjectId(normalizedId), normalizedId],
      },

      // Ignore expired sessions
      // $or: [{ expires: { $exists: false } }, { expires: { $gt: new Date() } }],
    },
    {
      $set: fields,
    },
  );

  return result.modifiedCount;
};
