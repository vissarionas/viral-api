const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const users = require('./users');
const mailer = require('./mailer');

const signAndSendToken = (req, res, externalUser) => {
  const payload = externalUser
    ? { id: externalUser._id, email: externalUser.email }
    : { id: req.user.id, email: req.user.email };
  jwt.sign(payload, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION },
    (err, token) => res.send(token));
};

const generateTemporaryToken = user => new Promise(function (resolve, reject) {
  jwt.sign({ id: user._id, email: user.email },
    process.env.JWT_SECRET, { expiresIn: process.env.JWT_REGISTRATION_EXPIRATION },
    (err, token) => resolve(token),
    err => reject(err));
});

const registerEmailUser = (req, res) => {
  const { email } = req.body;
  const user = {
    _id: uniqid(),
    username: email.split('@')[0],
    email,
    password: bcrypt.hashSync(req.body.password, 10),
    provider: '',
    facebookId: '',
    verified: false
  };

  users.saveEmailUser(user)
    .then(() => {
      signAndSendToken(req, res, user);
      generateTemporaryToken(user)
        .then(tempToken => mailer.sendVerificationEmail(email, tempToken),
          err => res.send(err));
    }, err => res.send(err));
};

const verifyUser = (req, res) => {
  users.setUserAsVerified(req.user.email)
    .then(data => res.send(data),
      err => res.send(err));
};

module.exports = {
  registerEmailUser,
  signAndSendToken,
  verifyUser
};
