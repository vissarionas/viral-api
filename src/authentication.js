const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const database = require('./database');
const register = require('./register');
const config = require('config');

passport.use(new facebookTokenStrategy({
  clientID: config.get('App.facebookDevCredentials.FB_CLIENT_ID'),
  clientSecret: config.get('App.facebookDevCredentials.FB_CLIENT_SECRET'),
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile, null);
}));

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
      database.getUserByFacebookId(profile.id)
      .then(user => {
          register.signAndSendToken(req, res, user.id);
        }, (err) => {
          register.registerFacebookUser(req, res, profile);
        }
      );
    };
  })(req, res);
};

module.exports = {
  facebookAuthenticate,
};