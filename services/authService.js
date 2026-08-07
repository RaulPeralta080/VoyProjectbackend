const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.trim().toLowerCase() });
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username: username.trim().toLowerCase() });
};

const generateUniqueUsername = async (baseName) => {
  let clean = baseName.toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._]/g, "");
  if (!clean) clean = "usuario";
  
  let candidate = clean;
  let exists = await User.findOne({ username: candidate });
  let attempts = 0;
  
  while (exists && attempts < 20) {
    const randomNum = Math.floor(100 + Math.random() * 900);
    candidate = `${clean}${randomNum}`;
    exists = await User.findOne({ username: candidate });
    attempts++;
  }
  return candidate;
};

module.exports = {
  findUserByEmail,
  findUserByUsername,
  generateUniqueUsername
};
