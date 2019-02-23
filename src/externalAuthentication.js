const passport = require('passport');
const uniqid = require('uniqid');
const register = require('./register');
const users = require('./users');

const authenticateFacebookUser = (req, res, profile) => {
  const user = {
    _id: uniqid(),
    username: profile.name.givenName + profile.name.familyName,
    email: profile.emails[0].value,
    password: '',
    provider: 'facebook',
    facebookId: profile.id,
    verified: true
  };
  users.saveFacebookUser(user)
    .then(savedUser => register.signAndSendToken(req, res, savedUser),
      err => res.send(err));
};

const facebookAuthenticate = (req, res) => {
  passport.authenticate('facebook-token', (err, profile) => {
    if (profile) {
      authenticateFacebookUser(req, res, profile);
    } else if (err) {
      if (err.oauthError) {
        const oauthError = JSON.parse(err.oauthError.data);
        res.status(401).send(oauthError.error.message);
      } else {
        res.send(err);
      }
    }
  })(req, res);
};

module.exports = {
  facebookAuthenticate,
};
