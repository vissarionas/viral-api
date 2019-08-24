require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const config = require('config');
const { rootRouter, usersRouter, externalAuthRouter } = require('./router');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(morgan('common'));
app.use(compression());
app.use(cors({
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/auth', externalAuthRouter);

app.listen(config.get('server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
