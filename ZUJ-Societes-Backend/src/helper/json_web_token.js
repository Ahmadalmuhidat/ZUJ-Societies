const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = 'b9d4c4f4a13de41d9fe784e4f2107d5c8b8f2d2b3c56a6f73f396da7468b6c417c087ceae2142f8b6ba7e5da028581ba774b3c0c536dc8ff4e8e907f943f4a6e2';

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables.");
}

function generate_token(user) {
  if (!user?.id || !user?.email) {
    throw new Error("Invalid user object provided.");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verify_token(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.warn("Invalid or expired token:", err.message);
    return null;
  }
}

module.exports = {
  generate_token,
  verify_token,
};
