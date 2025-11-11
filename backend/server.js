import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import routes from "./routes/index.mjs";
import "./utils/passport.js";
import cors from "cors";
import { connectNeo4j } from "./config/neo4j.js";
import connectMongoDB from "./config/mongo.js";
import { producer, consumer } from "./config/kafka.js";
import "./kafka/consumer.js";

const app = express();
dotenv.config();
const port = 4000;

await connectMongoDB();
await connectNeo4j();

const closeKafka = async () => {
  producer.disconnect()
  consumer.disconnect()
  console.log("Disconnected Kafka 👋🏻")
}

process.on('SIGINT', closeKafka)
process.on('SIGTERM', closeKafka)

app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    credentials: true, // important for cookies
  })
);
app.use(express.json());
app.use(cookieParser("HelloWorld"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 days
      httpOnly: true,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(port, async () => {
  console.log("Server Started", port);
  try {
    console.log("✅ Trying to connect to Producer");
    await producer.connect();
    console.log("✅ Producer connected");
  } catch (err) {
    console.error("Producer failed to connect:", err);
  }
  console.log('✅ Application ready');
});
