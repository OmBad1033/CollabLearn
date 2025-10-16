import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
