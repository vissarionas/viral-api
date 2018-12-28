require('./src/passport-strategies');

const config = require('config').endpoints;
const express = require('express');
const passport = require('passport');
const externalAuthentication = require('./src/externalAuthentication');
const register = require('./src/register');
const login = require('./src/login');
const users = require('./src/users');
const posts = require('./src/posts');
const rootRouter = express.Router();
const externalAuthRouter = express.Router();

// middleware that is specific to this router
rootRouter.use(function timeLog (req, res, next) {
  console.log('Middleware example. Time: ', Date.now());
  next();
});

rootRouter.get('/', (req, res, next) => {
  setTimeout(() => {
    console.log('timeout');
    next();
  }, 5000);
}, (req, res) => res.send('ROOT'));

rootRouter.post(config.get('user'), passport.authenticate('jwt', { session: false }), (req, res) => {
  users.getUserById(req, res, req.query.user);
});

rootRouter.get(config.get('posts'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.getIntersectedPosts(req, res);
});

rootRouter.post(config.get('savePost'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.savePost(req, res);
});

rootRouter.post(config.get('login'), passport.authenticate('local', { session: false }), (req, res) => {
  login.logUserIn(req, res);
});

rootRouter.post(config.get('register'), (req, res) => {
  register.registerEmailUser(req, res);
});

rootRouter.get(config.get('verify'), passport.authenticate('jwt', { session: false }),  (req, res) => {
  register.verifyUser(req, res);
});

externalAuthRouter.post(config.get('facebook'), (req, res) => {
  externalAuthentication.facebookAuthenticate(req, res);
});

module.exports = {
  rootRouter,
  externalAuthRouter
};