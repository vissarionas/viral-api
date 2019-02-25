const generateToken = require('./shared/token');

const logIn = (req, res) => {
  const payload = { id: req.user._id, email: req.user.email };
  const accessToken = generateToken(payload, process.env.JWT_DURATION);
  res.send(accessToken);
  if (!req.user.verified) {
    // Send verification email
  }
};

module.exports = {
  logIn
};
