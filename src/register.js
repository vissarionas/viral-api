const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const users = require('./users');
const mailer = require('./mailer');

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
  
  users.saveEmailUser(user)
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

const authenticateFacebookUser = (req, res, profile) => {   
  const user = {
    _id: uniqid(),
    username: profile.name.givenName + profile.name.familyName,
    email: profile.emails[0].value,
    password: '',
    provider: 'facebook',
    facebookId: profile.id,
    verified: true
  }

  users.saveFacebookUser(user)
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
  jwt.sign( {userId: userId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}, (err, token) => {
    res.send(token);
  });
}

const sendVerificationEmail = (req, res) => {
  const email = req.user.email;
  mailer.createAndSendVerificationEmail(email)
}

module.exports = {
  registerEmailUser,
  authenticateFacebookUser,
  signAndSendToken,
  sendVerificationEmail
};
