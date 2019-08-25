require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const usersRouter = express.Router();
const Users = require('../src/users');

usersRouter.post('/register', (req, res) => {
  Users.registerEmailUser(req, res);
});

usersRouter.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.updateUserAsVerified(req, res);
});

usersRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  Users.logIn(req, res);
});

usersRouter.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.delete(req, res);
});

usersRouter.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
  Users.registerFacebookUser(req, res);
});

module.exports = usersRouter;
