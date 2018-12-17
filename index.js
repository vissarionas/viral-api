const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const authentication = require('./src/authentication');
const register = require('./src/register');
const config = require('config').App;

const app = express();

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
  res.status(200).send('ROOT');
});

app.get(config.get('endpoints.profile'), passport.authenticate('jwt', { session: false }), (req, res) => {
  // database.getProfile(req, res, req.user.userId);
});

app.get(config.get('endpoints.posts'), passport.authenticate('jwt', { session: false}), (req, res) => {
  // database.getAllPosts(req, res);
});

app.post(config.get('endpoints.login'), passport.authenticate('local', { session: false }), (req, res) => {
  res.send(req.user);
});

app.post(config.get('endpoints.register'), (req, res) => {
  register.registerEmailUser(req, res);
});

app.post(config.get('endpoints.facebookAuthenticate'), (req, res) => {
  authentication.facebookAuthenticate(req, res);
});

app.listen(config.get('server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
