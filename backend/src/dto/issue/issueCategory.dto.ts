import { ISSUE_PRIORITY } from "./issue.dto.js";

export const ISSUE_CATEGORY_PRIORITY = ISSUE_PRIORITY;
export const ISSUE_CATEGORY_PRIORITY_DEFAULT = ISSUE_CATEGORY_PRIORITY[1];

export type IssueCategoryPriority = (typeof ISSUE_CATEGORY_PRIORITY)[number];
