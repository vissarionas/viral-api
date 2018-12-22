require('./src/passport-strategies');

const config = require('config').endpoints;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const externalAuthentication = require('./src/externalAuthentication');
const register = require('./src/register');
const users = require('./src/users');
const posts = require('./src/posts');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res, next) => {
  setTimeout(() => {
    console.log('timeout');
    next();
  }, 5000);
}, (req, res) => res.send('ROOT'));

router.post(config.get('user'), passport.authenticate('jwt', { session: false }), (req, res) => {
  users.getUserById(req, res, req.query.user);
});

router.get(config.get('posts'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.getIntersectedPosts(req, res);
});

router.post(config.get('savePost'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.savePost(req, res);
});

router.post(config.get('login'), passport.authenticate('local', { session: false }), (req, res) => {
  register.signAndSendToken(req, res, req.user._id);
});

router.post(config.get('register'), (req, res) => {
  register.registerEmailUser(req, res);
});

router.post(config.get('facebookAuthenticate'), (req, res) => {
  externalAuthentication.facebookAuthenticate(req, res);
});

module.exports = router;