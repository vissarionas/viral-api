const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList
} = require('graphql');

const User = require('../user/user');
const Post = require('../post/post');

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
      resolve: async (global, args, context, info) => Post.get({ user: global._id })
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
      resolve: async (global, args, context, info) => User.get(args)
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
      resolve: async (global, args, context, info) => Post.get(args)
    }
  }
});

module.exports = new GraphQLSchema({
  query: QueryType
});
