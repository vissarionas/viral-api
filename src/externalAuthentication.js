const passport = require('passport');
const register = require('./register');

const facebookAuthenticate = (req, res) => {
  passport.authenticate('facebook-token', (err, profile, info) => {
    if (profile) {
     register.authenticateFacebookUser(req, res, profile);
    } else if (err) {
      if (err.oauthError) {
        let oauthError = JSON.parse(err.oauthError.data);
        res.status(401).send(oauthError.error.message);
      } else {
        res.send(err);
      }
    };
  })(req, res);
};

module.exports = {
  facebookAuthenticate,
};