const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hash_password(password) {
  if (!password) throw new Error('Password is required for hashing');
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function verify_password(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) {
    throw new Error('Both plain and hashed passwords are required');
  }
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hash_password,
  verify_password,
};