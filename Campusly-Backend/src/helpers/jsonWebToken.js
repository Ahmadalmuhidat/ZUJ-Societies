const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error("SECRET is not set in environment variables.");
}

exports.generateToken = (user) => {
  if (!user?.id || !user?.email) {
    throw new Error("Invalid user object provided.");
  }

  return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '30d' });
}

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.warn("Invalid or expired token:", err.message);
    return null;
  }
}

