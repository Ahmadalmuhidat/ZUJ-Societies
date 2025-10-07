const jsonWebToken = require('../helper/json_web_token');

function checkUserLoggedIn(req, res, next) {
  const token =
    req.headers['authorization']?.split(' ')[1] ||
    req.body?.token ||
    req.query?.token;

  if (!token) return res.status(401).json({ error_message: "Token not provided" });

  try {
    const userData = jsonWebToken.verify_token(token);
    if (userData) {
      req.user = userData;
      next();
    } else {
      res.status(401).json({ error_message: "Failed to verify the token" });
    }
  } catch (error) {
    res.status(401).json({ error_message: "Invalid or expired token" });
  }
}

module.exports = {
  checkUserLoggedIn
};
