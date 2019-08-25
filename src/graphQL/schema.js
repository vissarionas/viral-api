const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
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
    likes: {
      type: GraphQLInt,
      resolve: post => post.likes
    },
    longitude: {
      type: GraphQLFloat,
      resolve: post => post.point.longitude
    },
    latitude: {
      type: GraphQLFloat,
      resolve: post => post.point.latitude
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
        }
      },
      resolve: async parent => Post.getByUser({ user: parent._id })
    }
  },
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        _id: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      // eslint-disable-next-line arrow-body-style
      resolve: async (parent, args) => {
        // eslint-disable-next-line no-return-await
        return await User.get(args);
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: QueryType
});
