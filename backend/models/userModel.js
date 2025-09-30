import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: mongoose.Schema.Types.String },
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    googleId: { type: mongoose.Schema.Types.String },
    avatar: { type: mongoose.Schema.Types.String },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: mongoose.Schema.Types.String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema)