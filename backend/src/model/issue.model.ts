import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    issueNumber: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "OPEN",
        "TRIAGED",
        "ASSIGNED",
        "IN_PROGRESS",
        "BLOCKED",
        "RESOLVED",
        "CLOSED",
        "REOPENED",
        "CANCELLED",
      ],
      default: "OPEN",
      required: true,
    },

    issueCategory: {
      type: Schema.Types.ObjectId,
      ref: "IssueCategory",
    },

    priority: {
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
      required: true,
    },

    title: {
      type: String,
    },

    description: {
      type: String,
    },

    location: {
      building: {
        type: String,
      },
      floor: {
        type: String,
      },
      room: {
        type: String,
      },
      description: {
        type: String,
      },
    },

    attachments: [
      {
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],

    progressHistory: [
      {
        setBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: [
            "OPEN",
            "TRIAGED",
            "ASSIGNED",
            "IN_PROGRESS",
            "BLOCKED",
            "RESOLVED",
            "CLOSED",
            "REOPENED",
            "CANCELLED",
          ],
        },
        description: {
          type: String,
        },
        commitedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Issue = mongoose.model("Issue", issueSchema);

export { Issue };
