import { User } from "../models/userModel.js";
import { getNeo4jSession } from "../config/neo4j.js";
import { createUserQuery } from "../utils/neo4jQueries.js";

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
    console.log("🚀 Neo4j response:",response);
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
