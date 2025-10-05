import { Router } from "express";
import passport from "passport";
import authCheck from "../middleware/protectedRoute.js";
import { logout, status, requestOTP, verifyOtp, localLogin, googleCallback } from "../controller/authController.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.post("/logout", authCheck, logout);

router.get("/status", status);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

router.post("/request-otp",requestOTP);
router.post("/verify-otp", verifyOtp);
router.post("/login", localLogin, status)


export default router;
