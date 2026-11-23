import type mongoose from "mongoose";

export const ISSUE_STATUS = [
  "OPEN",
  "TRIAGED",
  "ASSIGNED",
  "IN_PROGRESS",
  "BLOCKED",
  "RESOLVED",
  "CLOSED",
  "REOPENED",
  "CANCELLED",
] as const;
export const ISSUE_STATUS_DEFAULT = ISSUE_STATUS[0];

export const ISSUE_PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const ISSUE_PRIORITY_DEFAULT = ISSUE_PRIORITY[1];

export type IssueStatus = (typeof ISSUE_STATUS)[number];
export type IssuePriority = (typeof ISSUE_PRIORITY)[number];

export type IssueCategory = {
  _id: string | mongoose.Schema.Types.ObjectId;
  organization: string | mongoose.Schema.Types.ObjectId;
  name: string;
  slug: string;

  description?: string;
  isActive: boolean;
  priority: IssuePriority;

  createAt: string;
  updatedAt: string;
};
