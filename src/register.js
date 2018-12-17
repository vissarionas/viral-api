const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
module.uniqid_debug = true;
const uniqid = require('uniqid');
const mongoUtils = require('./mongo/utils');
const config = require('config');

const registerEmailUser = (req, res) => {
  const email = req.body.email;
  const user = {
    _id: uniqid(),
    username: email.split('@')[0],
    email: email,
    password: bcrypt.hashSync(req.body.password, 10),
    provider: '',
    facebookId: '',
    verified: false
  }
  
  mongoUtils.saveEmailUser(user)
  .then(data => {
    if (data) {
      signAndSendToken(req, res, user._id);
    } else {
      res.status(409).send(userObject);
    }
  }, err => {
      res.send(err);
  });
};

const registerFacebookUser = (req, res, profile) => {   
  const user = {
    _id: uniqid(),
    username: profile.name.givenName + profile.name.familyName,
    email: profile.emails[0].value,
    password: '',
    provider: 'facebook',
    facebookId: profile.id,
    verified: true
  }

  mongoUtils.saveFacebookUser(user)
    .then(data => {
      if (data) {
        signAndSendToken(req, res, data._id);
      } else {
        res.status(409).send(userObject);
      }
  }, err => {
      res.send(err);
  });  
};

const signAndSendToken = (req, res, userId) => {
  jwt.sign( {userId: userId}, config.get('App.jwt.JWT_SECRET'), {expiresIn: config.get('App.jwt.EXPIRATION')}, (err, token) => {
    res.send(token);
  });
}

module.exports = {
  registerEmailUser,
  registerFacebookUser,
  signAndSendToken
};
