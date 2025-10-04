import { User } from "../models/userModel.js";
import { otpGenerator } from "../helper/otpGenerator.js";
import { OTP } from "../models/otpModel.js";
import { sendMail } from "../utils/email.js";

const status = (req, res) => {
  console.log("auth/status", request.user);
  return request.user ? response.send(request.user) : response.sendStatus(401);
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
      { otp },
      { expiresAt },
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

export { status, logout, requestOTP };
