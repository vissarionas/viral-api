require('../src/passport-strategies');

const express = require('express');
const passport = require('passport');
const graphqlHTTP = require('express-graphql');
const graphqlRouter = express.Router();
const schema = require('../src/graphQL/schema');

graphqlRouter.post('/', passport.authenticate('jwt', { session: false }),
  graphqlHTTP({
    schema,
  }));

module.exports = graphqlRouter;
