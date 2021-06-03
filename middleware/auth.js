const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.verifiedUser = verified.customer;
    console.log("Verification Success", verified);
    next();
  } catch (err) {
    console.log("verification failed", err);
    next();
  }
};
module.exports = { authenticate };
