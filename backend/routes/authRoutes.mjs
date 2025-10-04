import { Router } from "express";
import passport from "passport";
import authCheck from "../middleware/protectedRoute.js";
import { logout, status, requestOTP, verifyOtp } from "../controller/authController.js";

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
  status
);

router.post("/request-otp",requestOTP);

router.post("/verify-otp", verifyOtp)


export default router;
