const register = require('./register');

const logUserIn = (req, res) => {
  register.signAndSendToken(req, res);
  if (!req.user.verified) {
    // Send verification email
  }
}

module.exports = {
  logUserIn
}
