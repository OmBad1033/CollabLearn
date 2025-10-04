export default function authCheck(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401); // Unauthorized
}
