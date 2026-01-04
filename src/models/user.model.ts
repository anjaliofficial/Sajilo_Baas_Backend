import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "host"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
