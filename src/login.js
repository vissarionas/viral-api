const register = require('./register');

const logIn = (req, res) => {
  register.signAndSendToken(req, res);
  if (!req.user.verified) {
    // Send verification email
  }
};

module.exports = {
  logIn
};
