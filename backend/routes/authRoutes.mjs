import { Router } from "express";
import passport from "passport";
import authCheck from "../middleware/protectedRoute.js"

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);



router.get("/protected", authCheck, (req, res) => {
	res.json({ message: "You are logged in!", user: req.user });
  });

router.post("/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get("/status", (request, response) => {
	console.log("auth/status",request.user)
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/auth/status");
  }
);

export default router;
