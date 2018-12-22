const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const externalAuthentication = require('./src/externalAuthentication');
const register = require('./src/register');
const config = require('config').App;
const users = require('./src/users');
const posts = require('./src/posts');

const app = express();

require('dotenv').config();
require('./src/passport-strategies');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(compression());
app.use(cors({
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('ROOT');
});

app.post(config.get('endpoints.user'), passport.authenticate('jwt', { session: false }), (req, res) => {
  users.getUserById(req, res, req.query.user);
});

app.get(config.get('endpoints.posts'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.getIntersectedPosts(req, res);
});

app.post(config.get('endpoints.savePost'), passport.authenticate('jwt', { session: false}), (req, res) => {
  posts.savePost(req, res);
});

app.post(config.get('endpoints.login'), passport.authenticate('local', { session: false }), (req, res) => {
  register.signAndSendToken(req, res, req.user._id);
});

app.post(config.get('endpoints.register'), (req, res) => {
  register.registerEmailUser(req, res);
});

app.post(config.get('endpoints.facebookAuthenticate'), (req, res) => {
  externalAuthentication.facebookAuthenticate(req, res);
});

app.listen(config.get('server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
