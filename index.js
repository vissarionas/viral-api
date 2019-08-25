require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const config = require('config');
const postsRouter = require('./routers/posts');
const usersRouter = require('./routers/users');
const graphqlRouter = require('./routers/graphql');

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
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/graphql', graphqlRouter);

app.listen(config.get('server.port'), () => console.log('Server started on http://127.0.0.1:3000'));
