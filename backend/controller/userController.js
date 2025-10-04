import mongoose from "mongoose";
import { Follow } from "../models/followModel.js";
import { User } from "../models/userModel.js";

const follow = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const currentUserId = req.user._id;

    const [followingUser, currentUser] = await Promise.all([
      User.findById(id).session(session),
      User.findById(currentUserId).session(session),
    ]);

    if (!followingUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "User not found" });
    }

    if (id.toString() === currentUserId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: id,
    }).session(session);

    if (existingFollow) {
      // Unfollow
      await existingFollow.deleteOne({ session });

      currentUser.followingCount -= 1;
      followingUser.followersCount -= 1;

      await currentUser.save({ session });
      await followingUser.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow
      const newFollow = new Follow({
        follower: currentUserId,
        following: id,
      });
      await newFollow.save({ session });

      currentUser.followingCount += 1;
      followingUser.followersCount += 1;

      await currentUser.save({ session });
      await followingUser.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "User followed successfully",
        follow: newFollow,
      });
    }
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.sendStatus(500);
  }
};

export { follow };
