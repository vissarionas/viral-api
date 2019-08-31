require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const postsRouter = express.Router();
const Posts = require('../src/posts');

postsRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Posts.get(req, res);
});

module.exports = postsRouter;
