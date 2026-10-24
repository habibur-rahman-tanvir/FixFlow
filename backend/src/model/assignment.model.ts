import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
  {
    issue: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export { Assignment };
