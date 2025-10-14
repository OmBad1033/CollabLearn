import mongoose from "mongoose";
import { Follow } from "../models/followModel.js";
import { User } from "../models/userModel.js";
import {
  checkFollowStatus,
  followUser,
  unfollowUser,
} from "../services/userService.js";

const follow = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const currentUserId = req.user._id.toString();

    if (id.toString() === currentUserId) {
      session.endSession();
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const [followingUser, currentUser] = await Promise.all([
      User.findById(id).session(session),
      User.findById(currentUserId).session(session),
    ]);

    if (!followingUser) {
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    const existingFollow = await checkFollowStatus(currentUserId, id);

    if (existingFollow) {
      // Unfollow
      await unfollowUser(currentUserId, id);
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await followUser(currentUserId, id);
      return res.status(200).json({
        message: "User followed successfully",
      });
    }
  } catch (err) {
    console.error("Error at follow controller:",err);
    await session.abortTransaction();
    session.endSession();
    res.sendStatus(500);
  }
};

export { follow };
