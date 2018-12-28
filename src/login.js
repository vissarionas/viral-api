const register = require('./register');

const logUserIn = (req, res) => {
  if (req.user.verified) {
    register.signAndSendToken(req, res);
  } else {
    register.sendVerificationEmail(req, res);
  }
}

module.exports = {
  logUserIn
}
