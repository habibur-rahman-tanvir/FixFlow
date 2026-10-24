import mongoose, { Schema } from "mongoose";

const issueCategorySchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    priority: {
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const IssueCategory = mongoose.model("IssueCategory", issueCategorySchema);

export { IssueCategory };
