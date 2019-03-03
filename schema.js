const fetch = require('node-fetch');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} = require('graphql');

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'some user description',
  fields: {
    username: {
      type: GraphQLString,
      resolve: user => user.username
    },
    verified: {
      type: GraphQLBoolean,
      resolve: user => user.verified
    }
  },
});

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'some query description',
    fields: {
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          }
        },
        resolve: async (global, args, req) => {
          const headers = {};
          Object.keys(args).forEach((key) => {
            if (args[key]) headers[key] = args[key];
          });

          const accessToken = req.headers.access_token;
          const response = await fetch(`http://127.0.0.1:3000/user?access_token=${accessToken}`, { headers });
          const json = await response.json();
          return json;
        },
      }
    }
  }),
});
