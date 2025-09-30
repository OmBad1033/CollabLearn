import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import routes from "./routes/index.mjs"
import "./config/passport.js"

const app = express();
dotenv.config();
const port = 4000;
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected to database"))
  .catch((e) => console.log(e));

app.use(express.json());
app.use(cookieParser("HelloWorld"));
app.use(
  session({
    secret: "new web project",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(port, () => {
  console.log("Server Started", port);
});



