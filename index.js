require('dotenv').config();

const express = require('express');
const cors = require('cors');  
const morgan = require('morgan'); 
const compression = require('compression');
const passport = require('passport');
const config = require('config');
const router = require('./router');

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
app.use('/', router);

app.listen(config.get('server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
