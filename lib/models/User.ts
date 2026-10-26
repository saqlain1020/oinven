import mongoose, { Model, Document } from "mongoose";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: UserRole;
  _id: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
