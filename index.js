const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const authentication = require('./src/authentication');
const register = require('./src/register');
const database = require('./src/database');
const config = require('config');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');

const app = express();

passport.use(new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('App.jwt.JWT_SECRET')
}, (jwt_payload, done) => {
  return done(null, jwt_payload);
}));

passport.use(new LocalStrategy(
  (username, password, done) => {
    database.getUserByEmail(username)
    .then(user => {
      bcrypt.compare(password, user.value, (error, response) => {
        return done(null, response ? user : false);
      });
    }, err => {
      return done(err);
    });
  }
));

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
  res.status(200).send({message: "Root path"});
});

app.get(config.get('App.endpoints.user'), passport.authenticate('jwt', { session: false }), (req, res) => {
  database.getUserById(req.user.userId)
  .then((user) => {
    res.status(200).send(user);
  }, err => {
    res.status(404).send(err);
  });
});

app.post(config.get('App.endpoints.login'), passport.authenticate('local', { session: false }), (req, res) => {
  res.send(req.user);
});

app.post(config.get('App.endpoints.register'), (req, res) => {
  register.registerEmailUser(req, res);
});

app.post(config.get('App.endpoints.facebookAuthenticate'), (req, res) => {
  authentication.facebookAuthenticate(req, res);
});

app.listen(config.get('App.server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
