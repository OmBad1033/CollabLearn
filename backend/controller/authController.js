import { User } from "../models/userModel.js";
import { otpGenerator } from "../helper/otpGenerator.js";
import { OTP } from "../models/otpModel.js";
import { sendMail } from "../utils/email.js";
import bcrypt from "bcrypt";
import passport from "passport";

const status = (req, res) => {
  console.log("auth/status", req.user);
  return req.user ? res.send(req.user) : res.sendStatus(401);
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.sendStatus(500);
    }
    // Destroy session from MongoDB
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res.sendStatus(500);
      }
      res.clearCookie("connect.sid"); // use your session cookie name
      return res.sendStatus(200);
    });
  });
};

const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User already exist using this email" });

    const otp = otpGenerator();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //5 mins expire time

    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendMail(
      email, //to
      "Your OTP Code", //subject
      `Your verification code is ${otp}` //text
    );

    res.status(200).json({ message: "OTP send successfully to the email" });
  } catch (error) {
    console.log("Error while requesting OTP", error);
    res.sendStatus(500);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, username, password, otp } = req.body;
    const record = await OTP.findOne({ email });

    if (!record) return res.status(400).json({ message: "OTP not found" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    await OTP.deleteOne({ email });
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const localLogin = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).json({ message: info?.message || "Login failed" });
    }

    // Log the user into the session
    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
};

export { status, logout, requestOTP, verifyOtp, localLogin};
