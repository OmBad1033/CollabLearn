export default function authCheck(req, res, next) {
  console.log("Running Middleware is Authenticated");
  if (req.isAuthenticated()) {
    console.log("User is authenticated");
    return next();
  }
  console.log("User is not authenticated");
  console.log("req.user:", req.user);
  res.sendStatus(401); // Unauthorized
}
