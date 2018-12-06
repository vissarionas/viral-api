const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const authentication = require('./src/authentication');
const config = require('config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express();

passport.use(new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('App.jwt.JWT_SECRET')
}, (jwt_payload, done) => {
  return done(null, jwt_payload);
}));

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(compression());
app.use(cors({
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send(req.user);
});

app.post(config.get('App.endpoints.emailLogin'), (req, res) => {
  authentication.loginWithEmail(req, res);
});

app.post(config.get('App.endpoints.registerEmail'), (req, res) => {
  authentication.registerEmailUser(req, res);
});

app.post(config.get('App.endpoints.registerFacebook'), (req, res) => {
  authentication.facebookAuthenticate(req, res);
});

app.listen(config.get('App.server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
