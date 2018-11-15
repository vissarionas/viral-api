var express = require('express');
var cors = require('cors');  
var morgan = require('morgan'); 
var passport = require('passport');
var compression = require('compression');
var FacebookTokenStrategy = require('passport-facebook-token');

require('dotenv').config();

passport.use(new FacebookTokenStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
}, (accessToken, refreshToken, profile, done) => {
  let user = {
    'name': profile.name.givenName + ' ' + profile.name.familyName,
    'id': profile.id,
    'token': accessToken
  };
  return done(null, user, null);
}));

var app = express();

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
  res.send('HELLO WORLD!!');
});

app.get('/auth/facebook/token',
  (req, res) => {
    passport.authenticate('facebook-token', (err, user, info) => {
      if (err) {
        if (err.oauthError) {
          var oauthError = JSON.parse(err.oauthError.data);
          res.status(401).send(oauthError.error.message);
        } else {
          res.send(err);
        }
      } else {
        // res.set('Transfer-Encoding', 'chunked');
        res.status(200).send(user);
      }
  })(req, res);
});

app.listen(3000, () => console.log('Server started on http://127.0.0.1:3000'));
