const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');

passport.use(new JwtStrategy({
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.get('App.jwt.JWT_SECRET')
}, (jwt_payload, done) => {
  return done(null, jwt_payload.userId);
}));

passport.use(new facebookTokenStrategy({
  clientID: config.get('App.facebookDevCredentials.FB_CLIENT_ID'),
  clientSecret: config.get('App.facebookDevCredentials.FB_CLIENT_SECRET'),
}, (accessToken, refreshToken, profile, done) => {
  return done(profile);
}));


module.exports = {
  jwt: function (req, res) {
    passport.authenticate('jwt', { session: false }), (req, res) => {
      res.status(200).send(req.user);
    }
  },
  facebookToken: function (req, res) {
    passport.authenticate('facebook-token', function(error, user, info) {
      // do stuff with user
      res.ok();
    })(req, res);
  }
};