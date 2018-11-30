const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const authentication = require('./src/authentication');

const app = express();

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
  res.json({
    message: 'HELLO WORLD!!'
  });
});

app.post('/auth/facebook', (req, res) => {
  authentication.facebookAuthenticate(req, res);
});

app.post('/auth/register', (req, res) => {
  authentication.registerUser(req, res);
});

app.post('/auth/login', (req, res) => {
  authentication.login(req, res);
});

app.listen(3000, () => console.log('Server started on http://127.0.0.1:3000'));
