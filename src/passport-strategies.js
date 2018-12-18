const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const bcrypt = require('bcryptjs');
const mongoUsers = require('./mongo/users');

passport.use(new LocalStrategy(
  (username, password, done) => {
    mongoUsers.getUserByEmail(username)
    .then(user => {
      bcrypt.compare(password, user.password, (error, response) => {
        return done(null, response ? user : false);
      });      
    }, err => {
      return done(err);
    });
  }
));

passport.use(new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('App.jwt.JWT_SECRET')
}, (jwt_payload, done) => {
  return done(null, jwt_payload);
}));

passport.use(new facebookTokenStrategy({
  clientID: config.get('App.facebookDevCredentials.FB_CLIENT_ID'),
  clientSecret: config.get('App.facebookDevCredentials.FB_CLIENT_SECRET'),
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile, null);
}));
