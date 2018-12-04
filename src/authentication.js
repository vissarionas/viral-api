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

const createAndSaveToken = (req, res, userId) => {
  jwt.sign({userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    database.saveToken(userId, token)
    .then((token) => {
      res.status(200).send(token);
    })
  });
}

const registerEmailUser = (req, res) => {
  const email = req.body.email;
  database.getUserByEmail(email)
  .then(userObject => {
    if (!userObject) {
      const user = {};
      user.userName = email.split('@')[0];
      user.email = email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.active = true;
    
      database.saveUser(user)
        .then( data => {
          createAndSaveToken(req, res, data.id);
      }, err => {
          res.send(err);
      });
    } else {
      res.status(409).send();
    }
  }, err => {
    res.send(err);
  });
}

const registerFacebookUser = (req, res, profile) => {
  database.getUserByFacebookId(profile.id)
  .then(data => {
    if (!data) {
      const user = {};
      user.userName = profile.name.givenName + profile.name.familyName;
      user.email = profile.emails[0].value;
      user.provider = profile.provider;
      user.facebookId = profile.id;
      user.active = true;
    
      database.saveFacebookUser(user)
        .then( data => {
          createAndSaveToken(req, res, data.id);
      }, err => {
          res.send(err);
      });
    } else {
      res.status(409).send();
    }
  }, err => {
    res.send(err).send();
  });
}

const login = (req, res) => {
  
}

module.exports = {
  facebookAuthenticate,
  registerEmailUser,
  login
};