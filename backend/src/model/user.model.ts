import mongoose, { Model, Schema, type HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

interface User {
  name: string;
  email: string;
  hashedPass: string;
  isEmailVerified: boolean;
  avatar?: {
    url?: string;
    publicId?: string;
  } | null;
  userStatus: "active" | "suspended" | "deleted";
  role: "visitor" | "member" | "admin" | "manager" | "technician";
  managerOf: mongoose.Types.ObjectId[];
  technicianOf: mongoose.Types.ObjectId[];
  memberOf?: mongoose.Types.ObjectId | null;
}

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

userSchema.methods.verifyPassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.hashedPass);
};

const User = mongoose.model<User, Model<User, {}, UserMethods>>(
  "User",
  userSchema,
);

export { User };
