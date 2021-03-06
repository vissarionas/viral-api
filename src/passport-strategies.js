const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');
const User = require('./user');

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.get({ email: username })
      .then(user => bcrypt.compare(password, user.password, () => done(null, user)),
        err => done(err));
  }
));

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromHeader('access_token'),
    ExtractJwt.fromUrlQueryParameter('access_token')
  ]),
  secretOrKey: process.env.JWT_SECRET
}, (jwtPayload, done) => done(null, jwtPayload)));

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => done(null, profile, null)));
