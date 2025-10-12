import { Router } from "express";
import passport from "passport";
import authCheck from "../middleware/protectedRoute.js";
import { logout, status, requestOTP, verifyOtp, localLogin, callback } from "../controller/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/logout", authCheck, logout, callback);

router.get("/status", status);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  callback
);

router.post("/request-otp",requestOTP);
router.post("/verify-otp", verifyOtp, status);
router.post("/login", localLogin, status)


export default router;
