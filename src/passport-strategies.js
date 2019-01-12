const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const users = require('./users');

passport.use(new LocalStrategy(
  (username, password, done) => {
    users.getUserByEmail(username)
    .then(user => {
      bcrypt.compare(password, user.password, (error, response) => {
        return done(null, response ? response : user);
      });      
    }, err => {
      return done(err);
    });
  }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader('token'),
    ExtractJwt.fromUrlQueryParameter('token')
  ]),
  secretOrKey: process.env.JWT_SECRET
}, (jwt_payload, done) => {
  return done(null, jwt_payload);
}));

passport.use(new facebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile, null);
}));
