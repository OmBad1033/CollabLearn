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

export { status, logout };
