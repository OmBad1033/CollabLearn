import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member", "student"],
          default: "student",
        },
        meta: {
          addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          addedAt: {
            type: Date,
            default: Date.now,
          },
        },
      },
    ],
    type: {
      type: String,
      enum: ["study", "chat"],
      default: "chat",
    },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
