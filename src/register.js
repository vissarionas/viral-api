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
  .then(() => {
    signAndSendToken(req, res, user);
    generateRegistrationToken(user)
    .then(tempToken => {
      mailer.sendVerificationEmail(email, tempToken)
    }, err => {
      res.send(err);
    });
  }, err => {
    res.send(err);
  });
};

const signAndSendToken = (req, res, externalUser) => {
  const payload = externalUser
  ? { id: externalUser._id, email: externalUser.email }
  : { id: req.user.id, email: req.user.email };
  jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION}, (err, token) => {
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

const verifyUser = (req, res) => {
  users.setUserAsVerified(req.user.email)
  .then((data) => {
    res.send('USER VERIFIED. GO BACK TO THE APP');
  }, err => {
    res.send('USER ALREADY VERIFIED');
  });
};

module.exports = {
  registerEmailUser,
  signAndSendToken,
  verifyUser
};
