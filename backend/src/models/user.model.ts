import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    cognitoSub: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      maxlength: 255,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 241,
    },

    provider: {
      type: String,
      enum: ["email", "google"],
      required: true,
      default: "email",
    },
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = models.User || model("User", userSchema);