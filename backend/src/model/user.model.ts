import mongoose, { Model, Schema, type HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import type { User } from "../dto/user/user.dto.js";

interface UserMethods {
  verifyPassword(password: string): Promise<boolean>;
}

type UserDocument = HydratedDocument<User, UserMethods>;

const userSchema = new Schema<User>(
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

    verifiedBy: {
      type: String,
      enum: ["email", "google"],
      required: [true, "Verifying is required"],
    },

    password: {
      type: String,
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
  if (this.verifiedBy !== "email" || !this.password) return;
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.verifyPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model<User, Model<User, {}, UserMethods>>(
  "User",
  userSchema,
);

export { UserModel };
