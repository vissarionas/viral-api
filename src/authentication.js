const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('./database');
const config = require('config');

passport.use(new facebookTokenStrategy({
  clientID: config.get('App.facebookDevCredentials.FB_CLIENT_ID'),
  clientSecret: config.get('App.facebookDevCredentials.FB_CLIENT_SECRET'),
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile, null);
}));

const createAndSaveToken = (userId) => {
  jwt.sign({userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    database.saveToken(userId, token);
  });
}

const registerUser = (req, res, profile) => {
  const user = {};
  user.userName = req.body.email.split('@')[0];
  user.email = req.body.email;
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.active = true;

  database.saveUser(user)
    .then( data => {
      createAndSaveToken(data.id);
      res.status(200).send(data);
  }, err => {
      res.send(err);
  });
}

const registerFacebookUser = (req, res, profile) => {
  const user = {};
  user.userName = profile.name.givenName + profile.name.familyName;
  user.email = profile.emails[0].value;
  user.provider = profile.provider;
  user.providerUserId = profile.id;
  user.active = true;

  database.saveFacebookUser(user)
    .then( data => {
      createAndSaveToken(data.id);
      res.status(200).send(data);
  }, err => {
      res.send(err);
  });
}

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
      registerFacebookUser(req, res, profile);
    }
  })(req, res);
}

module.exports = {
  facebookAuthenticate,
  registerUser
};