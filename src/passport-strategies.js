const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcryptjs');
const users = require('./users');

const { ExtractJwt } = JwtStrategy;

passport.use(new LocalStrategy(
  (username, password, done) => {
    users.getUserByEmail(username)
      .then(user => bcrypt.compare(password, user.password, (err, res) => done(null, res || user)),
        err => done(err));
  }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader('token'),
    ExtractJwt.fromUrlQueryParameter('token')
  ]),
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => done(null, jwtPayload)));

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => done(null, profile, null)));
