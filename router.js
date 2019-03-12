require('./src/passport-strategies');

const express = require('express');
const passport = require('passport');
const graphqlHTTP = require('express-graphql');
const login = require('./src/login');
const posts = require('./src/posts');
const rootRouter = express.Router();
const externalAuthRouter = express.Router();
const schema = require('./src/graphQL/schema');
const user = require('./src/user');
const post = require('./src/post');

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

rootRouter.get('/graphql', passport.authenticate('jwt', { session: false }),
  graphqlHTTP({
    schema,
  }));

rootRouter.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  user.getUsers(req, res);
});

rootRouter.get('/post', passport.authenticate('jwt', { session: false }), (req, res) => {
  post.getPosts(req, res);
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
  user.createEmailUser(req, res);
});

rootRouter.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  user.verify(req, res);
});

externalAuthRouter.post('/facebook', passport.authenticate('facebook-token', { session: false }), (req, res) => {
  user.createOrUpdateFacebookUser(req, res);
});

module.exports = {
  rootRouter,
  externalAuthRouter
};
