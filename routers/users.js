require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const usersRouter = express.Router();
const { generateToken } = require('../src/shared/token');
const Users = require('../src/users');

usersRouter.post('/register', (req, res) => {
  Users.registerEmailUser(req, res);
});

usersRouter.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
  Users.registerFacebookUser(req, res);
});

usersRouter.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { email } = req.user;
  Users.update({ email }, { verified: true })
    .then(() => res.status(200).send({ message: 'verified' }))
    .catch(() => res.status(304));
});

usersRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  if (!req.user.verified) {
    // Send verification email
  }
  const payload = { id: req.user._id, email: req.user.email };
  const accessToken = generateToken(payload, process.env.JWT_DURATION);
  res.status(200).send({ accessToken });
});

usersRouter.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { email } = req.body;
  Users.delete({ email })
    .then(() => res.status(200).send({ message: 'deleted' }))
    .catch(({ message }) => res.status(404).send({ message }));
});

module.exports = usersRouter;
