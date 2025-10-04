import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: mongoose.Schema.Types.String, unique: true },
    email: { type: mongoose.Schema.Types.String, required: true, unique: true },
    googleId: { type: mongoose.Schema.Types.String },
    avatar: { type: mongoose.Schema.Types.String },
    password: { type: String },
    token: { type: mongoose.Schema.Types.String, default: null },
    accountType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
