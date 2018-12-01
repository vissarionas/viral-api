const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('./database');
const config = require('config');

passport.use(new facebookTokenStrategy({
  clientID: config.get('App.facebook.FB_CLIENT_ID'),
  clientSecret: config.get('App.facebook.FB_CLIENT_SECRET'),
}, (accessToken, refreshToken, profile, done) => {
  let user = {
    'first_name': profile.name.givenName,
    'last_name': profile.name.familyName,
    'email': profile.emails[0],
    'user_provider': profile.provider,
    'facebook_id': profile.id,
    'facebook_token': accessToken,
    'password': ''
  };
  return done(null, user, null);
}));

const signTokenToUser = (userId) => {
  jwt.sign({userId: userId}, config.get('App.jwt.JWT_SECRET'), (err, token) => {
    database.saveAccessToken(userId, token);
  });
}

const registerUser = (req, res, providerSpecific) => {
  const user = {};

  user.userName = req.body.email.split('@')[0];
  user.email = req.body.email;
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.active = true;

  if (providerSpecific) {
    user.providerUserId = providerSpecific.userId;
    user.provider = providerSpecific.provider;
  }
  database.saveUser(user)
    .then( data => {
      // token signing goes here
      console.log(data);
      res.send(200);
  })
}

const facebookAuthenticate = (req, res) => {
  passport.authenticate('facebook-token', (err, user, info) => {
    if (err) {
      if (err.oauthError) {
        let oauthError = JSON.parse(err.oauthError.data);
        res.status(401).send(oauthError.error.message);
      } else {
        res.send(err);
      }
    } else {
      res.status(200).send();
      register(req, res, user);
    }
  })(req, res);
}

module.exports = {
  facebookAuthenticate,
  registerUser
};