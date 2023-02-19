const jwt = require("jsonwebtoken");

const token = (email) => {
  return jwt.sign(
    {
      email: email,
    },
    process.env.secretKey,
    { expiresIn: "10d" }
  );
};

module.exports = token;
