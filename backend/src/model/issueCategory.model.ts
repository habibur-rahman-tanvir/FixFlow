import mongoose, { Schema } from "mongoose";
import {
  ISSUE_CATEGORY_PRIORITY,
  ISSUE_CATEGORY_PRIORITY_DEFAULT,
} from "../dto/issue/issueCategory.dto.js";

const issueCategorySchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization is required"],
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Issue category creator is required"],
      index: true,
      immutable: true,
    },

    name: {
      type: String,
      required: [true, "Issue category name is required"],
      trim: true,
      minlength: [2, "Issue category name must be at least 2 characters"],
    },

    slug: {
      type: String,
      required: [true, "Issue category slug is required"],
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    priority: {
      type: String,
      // enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      enum: ISSUE_CATEGORY_PRIORITY,
      // default: "MEDIUM",
      default: ISSUE_CATEGORY_PRIORITY_DEFAULT,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// issueCategorySchema.index({ organization: 1, slug: 1 }, { unique: true });
// issueCategorySchema.index({ organization: 1, name: 1 }, { unique: true });

const IssueCategoryModel = mongoose.model("IssueCategory", issueCategorySchema);

export { IssueCategoryModel };
