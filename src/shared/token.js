const jwt = require('jsonwebtoken');

const generateToken = (payload, duration) => {
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: duration }
  );
  return token;
};

module.exports = generateToken;
