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
    email: {
      type: GraphQLString,
      resolve: user => user.email
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
          _id: {
            type: GraphQLString
          },
          email: {
            type: GraphQLString
          },
          verified: {
            type: GraphQLBoolean
          }
        },
        resolve: async (global, args, context, info) => {
          try {
            const accessToken = context.headers.access_token;
            const response = await fetch(`http://127.0.0.1:3000/user?access_token=${accessToken}`, { headers: args });
            if (response.status !== 200) return null;
            const json = await response.json();
            return json;
          } catch (err) {
            return Promise.reject(err);
          }
        },
      }
    }
  }),
});
