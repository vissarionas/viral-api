require('./src/passport-strategies');

const express = require('express');
const passport = require('passport');
const externalAuthentication = require('./src/externalAuthentication');
const register = require('./src/register');
const login = require('./src/login');
const users = require('./src/users');
const posts = require('./src/posts');
const rootRouter = express.Router();
const externalAuthRouter = express.Router();
const user = require('./src/user');

rootRouter.use(function timeLog(req, res, next) {
  console.log('Middleware example. Time: ', Date.now());
  next();
});

rootRouter.get('/', (req, res, next) => {
  setTimeout(() => {
    console.log('timeout');
    next();
  }, 5000);
}, (req, res) => res.send('ROOT'));

rootRouter.post('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  users.getUserById(req, res, req.query.user);
});

rootRouter.get('/posts', passport.authenticate('jwt', { session: false }), (req, res) => {
  posts.getIntersectedPosts(req, res);
});

rootRouter.post('/savePost', passport.authenticate('jwt', { session: false }), (req, res) => {
  posts.savePost(req, res);
});

rootRouter.post('/like', passport.authenticate('jwt', { session: false }), (req, res) => {
  posts.likePost(req, res);
});

rootRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  login.logIn(req, res);
});

rootRouter.post('/register', (req, res) => {
  user.create(req, res);
});

rootRouter.get('/certify', passport.authenticate('jwt', { session: false }), (req, res) => {
  register.certifyUser(req, res);
});

externalAuthRouter.post('/facebook', (req, res) => {
  externalAuthentication.facebookAuthenticate(req, res);
});

module.exports = {
  rootRouter,
  externalAuthRouter
};
