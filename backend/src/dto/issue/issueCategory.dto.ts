import { ISSUE_PRIORITY } from "./issue.dto.js";

export const ISSUE_CATEGORY_PRIORITY = ISSUE_PRIORITY;
export type IssueCategoryPriority = (typeof ISSUE_CATEGORY_PRIORITY)[number];
