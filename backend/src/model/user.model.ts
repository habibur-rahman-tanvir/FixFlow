import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    hashedPass: {
      type: String,
      required: [true, "Password required"],
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    avatar: {
      url: String,
      publicId: String,
    },

    userStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["visitor", "member", "admin", "manager", "technician"],
      default: "visitor",
    },

    managerOf: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],

    technicianOf: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],

    memberOf: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("hashedPass")) return;
  const salt = await bcrypt.genSalt(10);
  this.hashedPass = await bcrypt.hash(this.hashedPass, salt);
});

userSchema.methods.verifyPassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export { User };
