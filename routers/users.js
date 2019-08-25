require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const usersRouter = express.Router();
const users = require('../src/users');

usersRouter.post('/register', (req, res) => {
  users.registerEmailUser(req, res);
});

usersRouter.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.updateUserAsVerified(req, res);
});

usersRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  users.logUserIn(req, res);
});

usersRouter.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.deleteUser(req, res);
});

usersRouter.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
  users.registerFacebookUser(req, res);
});

module.exports = usersRouter;
