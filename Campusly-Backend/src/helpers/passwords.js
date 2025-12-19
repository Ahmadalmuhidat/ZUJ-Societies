const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.hashPassword =  async (password) => {
  if (!password) {
    throw new Error('Password is required for hashing');
  }

  return await bcrypt.hash(password, SALT_ROUNDS);
}

exports.verifyPassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new Error('Both plain and hashed passwords are required');
  }

  return await bcrypt.compare(plainPassword, hashedPassword);
}