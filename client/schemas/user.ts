import { Schema, model, models } from "mongoose";
import { UserModel } from "./models";


const UserSchema = new Schema<UserModel>(
    {
      username: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      image: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      emailVerified: { type: Boolean, default: false },
      isAdmin: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true },
      acceptedTerms: { type: Boolean, default: false },
      lastFailedAttempts: { type: Number, default: 0 },
      totalFailedAttempts: { type: Number, default: 0 },
      lastAttempt: { type: Date },
    },
    { timestamps: true }
  );

  export const User = models.User || model("User", UserSchema);