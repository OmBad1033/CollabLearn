import { User } from "../models/userModel.js";
import { getNeo4jSession } from "../config/neo4j.js";
import {
  createUserQuery,
  followUserQuery,
  unfollowQuery,
  followStatusQuery,
} from "../utils/neo4jQueries.js";
import mongoose from "mongoose";

export const createUser = async (userData) => {
  const neoSession = getNeo4jSession();
  try {
    const mongoUser = new User({
      email: userData.email,
      username: userData.username,
      password: userData.hashedPassword,
    });
    const saveUser = await mongoUser.save();
    const response = await neoSession.run(createUserQuery, {
      id: saveUser._id.toString(),
      username: saveUser.username,
      email: saveUser.email,
    });
    console.log("🚀 Neo4j response:", response);
    return saveUser;
  } catch (error) {
    console.log(error);
    if (error.code !== 11000) {
      await User.deleteOne({ email: userData.email });
    }
    throw new Error("User creation failed — rolled back");
  } finally {
    await neoSession.close();
  }
};

export const followUser = async (followerId, followingId) => {
  console.log("Follower:", followerId.toString(), "Following:", followingId);
  const neoSession = getNeo4jSession();
  const mongoSession = await mongoose.startSession();
  try {
    await mongoSession.startTransaction();
    const result = await neoSession.run(followUserQuery, {
      followerId,
      followingId,
    });
    console.log("Result:", result);
    if (result.records.length === 0) {
      throw new Error("Failed to follow user in Neo4j");
    }

    await Promise.all([
      User.findByIdAndUpdate(
        followerId,
        { $inc: { followersCount: 1 } },
        { session: mongoSession }
      ),
      User.findByIdAndUpdate(
        followingId,
        { $inc: { followingCount: 1 } },
        { session: mongoSession }
      ),
    ]);
    await mongoSession.commitTransaction();
    return true;
  } catch (error) {
    console.log("Error while following user:", error);
    await mongoSession.abortTransaction();
    throw new Error("Failed to follow user");
  } finally {
    await mongoSession.endSession();
    await neoSession.close();
  }
};

export const unfollowUser = async (followerId, followingId) => {
  const neoSession = getNeo4jSession();
  const mongoSession = await mongoose.startSession();
  try {
    mongoSession.startTransaction();
    const result = await neoSession.run(unfollowQuery, {
      followerId,
      followingId,
    });
    const deleted = result.records[0]?.get("deleted").toNumber() || 0;
    if (deleted === 0) {
      throw new Error("Failed to unfollow user in Neo4j");
    }
    await Promise.all([
      User.findOneAndUpdate(
        followerId,
        { $inc: { followersCount: -1 } },
        { session: mongoSession }
      ),
      User.findOneAndUpdate(
        followingId,
        { $inc: { followingCount: -1 } },
        { session: mongoSession }
      ),
    ]);

    await mongoSession.commitTransaction();
    return true;
  } catch (error) {
    console.log("Error while unfollowing user:", error);
    await mongoSession.abortTransaction();
    throw new Error("Failed to unfollow user");
  } finally {
    await mongoSession.endSession();
    await neoSession.close();
  }
};

export const checkFollowStatus = async (followerId, followingId) => {
  const neoSession = getNeo4jSession();
  try {
    const result = await neoSession.run(followStatusQuery, { followerId, followingId });
    // console.log("Result:", result);
    const isFollowing = result.records[0]?.get("isFollowing") || false;
    return isFollowing;
  } catch (error) {
    console.log("Error while checking follow status: ", error);
    return false;
  } finally {
    await neoSession.close();
  }
};
