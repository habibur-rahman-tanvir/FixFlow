import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      minlength: [2, "Organization name must be at least 2 characters"],
    },

    slug: {
      type: String,
      required: [true, "Organization slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, "Organization slug must be at least 2 characters"],
    },

    manager: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
    },

    logo: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },

    banner: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },

    timezone: {
      type: String,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organization creator is required"],
      immutable: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const OrganizationModel = mongoose.model("Organization", organizationSchema);

export { OrganizationModel };
