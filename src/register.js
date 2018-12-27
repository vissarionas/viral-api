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
  .then(() => sendVerificationEmail(req, res, user), err => res.send(err));
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

const signAndSendToken = (req, res) => {
  jwt.sign( {id: req.user.id, email: req.user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}, (err, token) => {
    res.send(token);
  });
};

const generateRegistrationToken = (user) => {
  return new Promise(function (resolve, reject) {
    jwt.sign( {id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_REGISTRATION_EXPIRATION}, (err, token) => {
      resolve(token);
    }, err => {
      reject(err);
    });
  });
};

const sendVerificationEmail = (req, res, user) => {
  generateRegistrationToken(user)
  .then(token => {
    mailer.createAndSendVerificationEmail(req, res, user.email, token)
  }, err => {
    res.send(err);
  })
};

const verifyUser = (req, res) => {
  users.setUserAsVerified(req.user.email)
  .then(() => signAndSendToken(req, res), err => console.log(err));
};

module.exports = {
  registerEmailUser,
  authenticateFacebookUser,
  signAndSendToken,
  sendVerificationEmail,
  verifyUser
};
