const jwt = require("jsonwebtoken");
const createJwtToken = (customer) => {
  return jwt.sign({ customer }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
module.exports = { createJwtToken };
