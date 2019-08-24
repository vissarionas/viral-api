require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const usersRouter = express.Router();
const user = require('../src/user');

usersRouter.post('/register', (req, res) => {
  user.registerEmailUser(req, res);
});

usersRouter.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  user.updateUserAsVerified(req, res);
});

usersRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  user.logUserIn(req, res);
});

usersRouter.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  user.deleteUser(req, res);
});

usersRouter.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
  user.registerFacebookUser(req, res);
});

module.exports = usersRouter;
