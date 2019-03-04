const config = require('config').mongo;
const getCollection = require('../shared/collectionClient');

const Post = {};

(async () => {
  this.collection = await getCollection(config.get('collections.posts'));
})();

Post.get = async (params) => {
  try {
    const postsCursor = await this.collection.find(params);
    // iterate instead of transforming to array
    const posts = await postsCursor.toArray();
    // eslint-disable-next-line no-throw-literal
    if (!posts.length) throw { status: 404, message: 'no posts found' };
    return posts;
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = Post;
