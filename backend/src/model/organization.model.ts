import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
    },

    slug: {
      type: String,
      unique: true,
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
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Organization = mongoose.model("Organization", organizationSchema);

export { Organization };
