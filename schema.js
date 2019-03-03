const fetch = require('node-fetch');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
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

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
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
          if (response.status !== 200) {
            throw (new Error(response.statusText));
          }
          return await response.json();
        } catch (err) {
          return Promise.reject(err);
        }
      },
    }
  }
});

module.exports = new GraphQLSchema({
  query: QueryType
});
