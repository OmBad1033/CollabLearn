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
import { kafkaProducer } from "./kafka/producer.js";
import { registerConsumers } from "./kafka/consumers/index.js";
import { kafkaConsumer } from "./kafka/consumer.js";

const app = express();
dotenv.config();
const port = 4000;

await connectMongoDB();
await connectNeo4j();

process.on('SIGTERM', async () => {
  await kafkaConsumer.disconnect();
  await kafkaProducer.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await kafkaConsumer.disconnect();
  await kafkaProducer.disconnect();
  process.exit(0);
});

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

const initializeKafka = async () => {
  try {
    console.log("✅ Trying to connect to Consumer");
    registerConsumers(kafkaConsumer);
    await kafkaConsumer.start();
  } catch (err) {
    console.error("consumer failed to connect:", err);
  }
};

await initializeKafka()

app.listen(port, async () => {
  console.log("Server Started", port);
  await kafkaProducer.connect();
  console.log("✅ Application ready!!");
});
