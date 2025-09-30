import express, { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  return res.sendStatus(200);
});

router.post("/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get("/auth/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/auth/status");
  }
);

export default router;
