const passport = require('passport');
const facebookTokenStrategy = require('passport-facebook-token');

require('dotenv').config();

passport.use(new facebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  let user = {
    'name': profile.name.givenName,
    'id': profile.id,
    'token': accessToken,
    "refreshToken": refreshToken
  };
  return done(null, user, null);
}));

const authenticate = (req, res) => {
  passport.authenticate('facebook-token', (err, user, info) => {
    if (err) {
      if (err.oauthError) {
        let oauthError = JSON.parse(err.oauthError.data);
        res.status(401).send(oauthError.error.message);
      } else {
        res.send(err);
      }
    } else {
      // res.set('Transfer-Encoding', 'chunked');
      res.status(200).send(user);
    }
  })(req, res);
}

module.exports = {
  authenticate: authenticate
}