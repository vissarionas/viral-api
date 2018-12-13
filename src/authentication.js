const passport = require('passport');
const register = require('./register');
const mongoUtils = require('./mongo/utils');

require('./passport-strategies');

const facebookAuthenticate = (req, res) => {
  passport.authenticate('facebook-token', (err, profile, info) => {
    if (err) {
      if (err.oauthError) {
        let oauthError = JSON.parse(err.oauthError.data);
        res.status(401).send(oauthError.error.message);
      } else {
        res.send(err);
      }
    } else {
      mongoUtils.getUserByFacebookId(profile.id)
      .then(user => {
        if (user) {
          register.signAndSendToken(req, res, user.id);
        } else {
          register.registerFacebookUser(req, res, profile);
        }
      });
    };
  })(req, res);
};

module.exports = {
  facebookAuthenticate,
};