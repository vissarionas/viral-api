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
          }
        },
        resolve: async (global, args) => {
          const response = await fetch(`http://127.0.0.1:3000/user?userId=${args.id}&access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNvYXpyaTg3ZnZqc3I3OHBqbyIsImVtYWlsIjoia2F0ZXJpbmEyQGdtYWlsLmNvbSIsImZhY2Vib29raWQiOiIiLCJpYXQiOjE1NTE1MTM3NzksImV4cCI6MTU1NDEwNTc3OX0.wp2GtNQWXfIUORq0twwbNkEkz7YECw74Bg5ZFmpaxmc`);
          const json = await response.json();
          return json;
        },
      }
    }
  }),
});
