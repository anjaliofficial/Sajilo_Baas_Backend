import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  address: string;
  contactNumber: string;
  role: "admin" | "user" | "host";
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "host"], default: "user" },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
