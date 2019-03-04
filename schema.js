const fetch = require('node-fetch');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    user: {
      type: GraphQLString,
      resolve: post => post.user,
    },
    content: {
      type: GraphQLString,
      resolve: post => post.content
    },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLString,
      resolve: user => user._id,
    },
    username: {
      type: GraphQLString,
      resolve: user => user.username,
    },
    email: {
      type: GraphQLString,
      resolve: user => user.email,
    },
    verified: {
      type: GraphQLBoolean,
      resolve: user => user.verified,
    },
    posts: {
      type: GraphQLList(PostType),
      args: {
        user: {
          type: GraphQLString
        },
        content: {
          type: GraphQLString
        }
      },
      resolve: async (global, args, context, info) => {
        try {
          const accessToken = context.headers.access_token;
          const user = global._id;
          const response = await fetch(`http://127.0.0.1:3000/post?access_token=${accessToken}`, { headers: { user } });
          if (response.status !== 200) {
            throw (new Error(response.statusText));
          }
          return await response.json();
        } catch (err) {
          return Promise.reject(err);
        }
      },
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
    },
    posts: {
      type: new GraphQLList(PostType),
      args: {
        user: {
          type: GraphQLString
        },
        content: {
          type: GraphQLString
        }
      },
      resolve: async (global, args, context, info) => {
        try {
          const accessToken = context.headers.access_token;
          const response = await fetch(`http://127.0.0.1:3000/post?access_token=${accessToken}`, { headers: args });
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
