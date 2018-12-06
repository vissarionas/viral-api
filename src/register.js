const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('./database');
const config = require('config');

const registerEmailUser = (req, res) => {
  const email = req.body.email;
  database.getUserByEmail(email)
  .then(userObject => {
    res.status(409).send();
  }, (err) => {
    const user = {};
    user.userName = email.split('@')[0];
    user.email = email;
    user.password = bcrypt.hashSync(req.body.password, 10);
    user.active = true;
  
    database.saveEmailUser(user)
      .then( data => {
        signAndSendToken(req, res, data.id);
    }, err => {
        res.send(err);
    }); 
  });
};

const registerFacebookUser = (req, res, profile) => {
  const user = {
    userName: profile.name.givenName + profile.name.familyName,
    email: profile.emails[0].value,
    provider: profile.provider,
    facebookId: profile.id,
    active: true
  };

  database.saveFacebookUser(user)
    .then( data => {
      signAndSendToken(req, res, data.id);
  });
}

const signAndSendToken = (req, res, userId) => {
  jwt.sign( {userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    res.send(token);
  });
}

module.exports = {
  registerFacebookUser,
  registerEmailUser,
  signAndSendToken
};
