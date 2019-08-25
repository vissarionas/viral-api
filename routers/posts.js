require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const postsRouter = express.Router();
const posts = require('../src/post');

postsRouter.post('/savePost', passport.authenticate('jwt', { session: false }), (req, res) => {
  posts.savePost(req, res);
});

postsRouter.post('/like', passport.authenticate('jwt', { session: false }), (req, res) => {
  posts.likePost(req, res);
});

module.exports = postsRouter;
