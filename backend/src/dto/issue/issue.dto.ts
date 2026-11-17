import type mongoose from "mongoose";

export const ISSUE_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

type IssuePriority = (typeof ISSUE_PRIORITY)[number];

export type IssueCategory = {
  _id: string | mongoose.Schema.Types.ObjectId;
  organization: string | mongoose.Schema.Types.ObjectId;
  name: string;
  slug: string;

  description?: string;
  isActive: boolean;
  priority: IssuePriority;
};
